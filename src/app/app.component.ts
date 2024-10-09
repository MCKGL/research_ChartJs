import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ChartPieComponent} from "./features/charts/chart-pie/chart-pie.component";
import {ChartBarComponent} from "./features/charts/chart-bar/chart-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChartPieComponent, ChartBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Angular_ChartJs';
}
