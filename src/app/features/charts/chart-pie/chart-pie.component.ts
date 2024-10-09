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

  private getColor(ecv: number, minEcv: number, maxEcv: number): string {
    // Normaliser la valeur de ecv entre 0 et 1 (inversé)
    const normalized = (maxEcv - ecv) / (maxEcv - minEcv);

    // Limiter les valeurs normalisées entre 0 et 1
    const clamped = Math.max(0, Math.min(1, normalized));

    // Calculer les composants RGB
    const green = Math.round(255 * clamped); // Vert augmente avec la baisse de ecv
    const red = 255 - green; // Rouge diminue avec la baisse de ecv

    return `rgb(${red}, ${green}, 50)`; // Couleur entre rouge et vert
  }

  ngOnInit(): void {
    this.dataChauffageSubscription = this.chauffageService.getDatasChauffage(this.metresCarres).subscribe(
      response => {
        this.datasChauffage = response.data;
        const ecvData = this.datasChauffage.map(chauffage => chauffage.ecv);
        const labels = this.datasChauffage.map(chauffage => chauffage.name);

        // Trouver les valeurs min et max de ecv
        const minEcv = Math.min(...ecvData);
        const maxEcv = Math.max(...ecvData);
        const backgroundColors = ecvData.map(ecv => this.getColor(ecv, minEcv, maxEcv));

        this.createChart(ecvData, labels, backgroundColors);
      }
    );
  }

  getChartData() {
    console.log(this.metresCarres);
  }

  ngOnDestroy(): void {
    if (this.dataChauffageSubscription) {
      this.dataChauffageSubscription.unsubscribe();
    }
  }
}
