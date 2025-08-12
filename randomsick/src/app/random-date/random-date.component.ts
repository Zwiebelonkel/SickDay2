import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type MonthPick = { year: number; month: number }; // month: 0-11

@Component({
  selector: 'app-random-date',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './random-date.component.html',
  styleUrls: ['./random-date.component.scss'],
})
export class RandomDateComponent {
  view: MonthPick;
  weeks: (Date | null)[][] = []; // Kalenderraster (Mo-So)
  selected: Date[] = []; // 1 oder 2 Tage

  constructor() {
    // initial: aktueller Monat anzeigen (ohne Auswahl)
    const now = new Date();
    this.view = { year: now.getFullYear(), month: now.getMonth() };
    this.buildCalendar();
  }

  /** Klick-Handler: wählt Monat + Datum (nur Di/Mi/Do) und baut Kalender */
  pickRandom() {
    const { year, month } = this.pickRandomMonth();
    const dates = this.pickDates(year, month); // 1 oder 2 Tage (Di/Mi/Do)
    this.view = { year, month };
    this.selected = dates;
    this.buildCalendar();
  }

  /** 0..2 Monate ab jetzt */
  private pickRandomMonth(): MonthPick {
    const base = new Date();
    const offset = Math.floor(Math.random() * 3); // 0=aktuell,1=+1,2=+2
    const m = base.getMonth() + offset;
    return {
      year: base.getFullYear() + Math.floor(m / 12),
      month: ((m % 12) + 12) % 12,
    };
  }

  /** Liefert 1 oder 2 gültige Tage in dem Monat (nur Di/Mi/Do; bei 2 Tagen nur Di+Mi oder Mi+Do; kein Monatswechsel) */
  private pickDates(year: number, month: number): Date[] {
    const lastDay = new Date(year, month + 1, 0).getDate();

    const isTueWedThu = (d: Date) => {
      const w = d.getDay(); // 0 So ... 6 Sa
      return w === 2 || w === 3 || w === 4; // Di Mi Do
    };

    // Alle gültigen Einzeltage sammeln
    const singleCandidates: Date[] = [];
    // Kandidaten für Start eines 2-Tage-Blocks (nur Di oder Mi + nächster Tag im Monat)
    const pairStarts: Date[] = [];

    for (let day = 1; day <= lastDay; day++) {
      const d = new Date(year, month, day);
      if (isTueWedThu(d)) singleCandidates.push(d);

      const w = d.getDay();
      if ((w === 2 || w === 3) && day + 1 <= lastDay) {
        // Di oder Mi UND nicht über Monatsende
        const next = new Date(year, month, day + 1);
        // next ist dann Mi oder Do (automatisch kein Fr)
        pairStarts.push(d);
      }
    }

    // 50% Chance auf 2 Tage – nur wenn möglich
    const wantTwo = Math.random() < 0.5 && pairStarts.length > 0;

    if (wantTwo) {
      const start = pairStarts[Math.floor(Math.random() * pairStarts.length)];
      const end = new Date(start);
      end.setDate(start.getDate() + 1);
      return [start, end];
    }

    // sonst ein einzelner Tag
    const one =
      singleCandidates[Math.floor(Math.random() * singleCandidates.length)];
    return [one];
  }

  /** Baut Kalenderwochen (Montag als Wochenstart) für den aktuellen view-Monat */
  private buildCalendar() {
    const { year, month } = this.view;
    const first = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();

    // Montag=0 … Sonntag=6
    const firstWeekdayMon0 = (first.getDay() + 6) % 7;
    const cells: (Date | null)[] = [];

    // Leere Zellen vor dem 1. des Monats
    for (let i = 0; i < firstWeekdayMon0; i++) cells.push(null);

    // Alle Tage des Monats
    for (let d = 1; d <= lastDay; d++) cells.push(new Date(year, month, d));

    // Auf volle Wochen auffüllen
    while (cells.length % 7 !== 0) cells.push(null);

    // In Wochen schneiden
    this.weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      this.weeks.push(cells.slice(i, i + 7));
    }
  }

  // Helpers fürs Template
  isSelected(d: Date | null): boolean {
    if (!d) return false;
    return this.selected.some((s) => this.sameDate(s, d));
  }
  isRangeStart(d: Date | null): boolean {
    if (!d || this.selected.length < 2) return false;
    return this.sameDate(this.selected[0], d);
  }
  isRangeEnd(d: Date | null): boolean {
    if (!d || this.selected.length < 2) return false;
    return this.sameDate(this.selected[1], d);
  }
  private sameDate(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  monthLabel(): string {
    const d = new Date(this.view.year, this.view.month, 1);
    return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }
}
