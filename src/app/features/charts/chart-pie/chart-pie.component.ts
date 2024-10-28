import {Component, OnDestroy, OnInit} from '@angular/core';
import {Chart} from "chart.js";
import {FormsModule} from "@angular/forms";
import {ChauffageService} from "../../../core/services/chauffage.service";
import {Subscription} from "rxjs";
import {ChauffageModel} from "../../../core/models/chauffage.model";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-chart-pie',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './chart-pie.component.html',
  styleUrl: './chart-pie.component.scss'
})
export class ChartPieComponent implements OnInit, OnDestroy {
  protected metresCarres: number = 40;
  protected chart!: Chart<"pie", number[], string>;
  private datasChauffage!: ChauffageModel[];
  private dataChauffageSubscription!: Subscription;

  constructor(
    private chauffageService: ChauffageService,
  ) {
  }

  createChart(data: number[], labels: string[], backgroundColors: string[]): void {

    // Destroy the previous chart if it exists, so we can create a new one with the button if we want to
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("MyChartPie", {
      type: 'pie',

      data: {
        labels: labels,
        datasets: [{
          label: 'Emission totale en kg de CO₂e par mètre carré',
          data: data,
          backgroundColor: backgroundColors,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            enabled: true,
          }
        }
      }
    })
  };

  // Let's get the color of the pie chart slice depending on the value of ecv !
  private getColor(ecv: number, minEcv: number, maxEcv: number): string {
    // Normalize the value of ecv between 0 and 1 (inverted) because we want the color to be red when ecv is high
    const normalized = (maxEcv - ecv) / (maxEcv - minEcv);

    // limit the value between 0 and 1
    const clamped = Math.max(0, Math.min(1, normalized));

    // calculate the color between red and green
    const green = Math.round(255 * clamped); // Green up with the rise of ecv
    const red = 255 - green; // Red down with the rise of ecv

    return `rgb(${red}, ${green}, 50)`; // return the color in rgb format
  }

  ngOnInit(): void {
    this.generateChart();
  }

  // Generate chart. So we can call it from the template.
  // Not very interesting here, because the datas are proportional, so the graph will always be the same.
  private generateChart() : void {
    this.dataChauffageSubscription = this.chauffageService.getDatasChauffage(this.metresCarres).subscribe(
      response => {
        this.datasChauffage = response.data;
        const ecvData = this.datasChauffage.map(chauffage => chauffage.ecv);
        const labels = this.datasChauffage.map(chauffage => chauffage.name);

        // Find the min and max values of ecv
        const minEcv = Math.min(...ecvData);
        const maxEcv = Math.max(...ecvData);
        // Get the color of each slice of the pie chart
        const backgroundColors = ecvData.map(ecv => this.getColor(ecv, minEcv, maxEcv));

        this.createChart(ecvData, labels, backgroundColors);
      }
    );
  }

  getChartData() {
    this.generateChart();
  }

  ngOnDestroy(): void {
    if (this.dataChauffageSubscription) {
      this.dataChauffageSubscription.unsubscribe();
    }
  }
}
