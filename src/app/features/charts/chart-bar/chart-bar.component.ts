import {Component, OnInit} from '@angular/core';
import {Chart, registerables} from "chart.js";

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [],
  templateUrl: './chart-bar.component.html',
  styleUrl: './chart-bar.component.scss'
})
export class ChartBarComponent implements OnInit {
  public chart!: Chart<"bar", string[], string>;

  createChart(): void{
    this.chart = new Chart("MyChartBar", {
      type: 'bar',

      data: {
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
          '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ],
        datasets: [
          {
            label: "Sales",
            data: ['467','576', '572', '79', '92',
              '574', '573', '576'],
            backgroundColor: 'blue'
          },
          {
            label: "Profit",
            data: ['542', '542', '536', '327', '17',
              '0.00', '538', '541'],
            backgroundColor: 'limegreen'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
    });
  }

  ngOnInit(): void {
    this.createChart();
  }

}
