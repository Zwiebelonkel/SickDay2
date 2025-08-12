import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RandomDateComponent } from './random-date/random-date.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RandomDateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'randomsick';
}
