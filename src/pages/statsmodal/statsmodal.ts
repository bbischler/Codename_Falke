import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ModalOptions, Modal } from 'ionic-angular';
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Chart } from "chart.js";
import { X01stats } from "../../models/x01stats";

/**
 * Generated class for the StatsmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statsmodal',
  templateUrl: 'statsmodal.html',
})
export class StatsmodalPage {

  @ViewChild("lineCanvas") lineCanvas: ElementRef;
  @ViewChild("barCanvas") barCanvas: ElementRef;


  pageName = 'MODAL';
  private lineChart: Chart;
  private barChart: Chart;

  game: X01stats;
  labels: String[] = [];
  colors: String[] = ["rgb(28, 230, 162)", "rgb(50, 130, 162)", "rgb(28, 200, 62)", "rgb(128, 130, 162)", "rgb(128, 230, 62)", "rgb(68, 80, 62)", "", "rgb(28, 0, 162)"];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.game = navParams.get('game');

  }

  ionViewDidLoad() {
    for (let i = 1; i < this.game.players[0].avgPerLeg.length + 1; i++) {
      this.labels.push(i.toString());
    }
    this.setLineChart();
    this.setBarTotalScore();
  }

  getTotalScore(scores: number[]) {
    let total = 0;
    for (let t of scores) {
      total += t;
    }
    return total;
  }

  closeModal() {
    this.navCtrl.pop();
  }

  setLineChart() {
    this.drawLineChart();
    for (let i = 0; i < this.game.players.length; i++) {

      this.lineChart.data.datasets[i] = (
        {
          label: this.game.players[i].name,
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: this.colors[i],
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: this.colors[i],
          pointBackgroundColor: this.colors[i],
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,
          data: this.game.players[i].avgPerLeg,
          spanGaps: true
        }
      );
      this.lineChart.update();
    }
  }

  setBarTotalScore() {
    this.drawBarChart();
    for (let i = 0; i < this.game.players.length; i++) {

      this.barChart.data.datasets[i] = (
        {
          label: this.game.players[i].name,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: this.colors[i],
          borderWidth: 1,
          data: this.game.players[i].totalPointsPerLeg,
        }
      );
      this.barChart.update();
    }
  }

  drawLineChart() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      options: {
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 20,
              precision: 0,
              autoSkip: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'Average'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: '# Games'
            }
          }]
        }
      },
      data: {
        labels: this.labels,
        datasets: []
      }
    });
  }

  drawBarChart() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: this.labels,
        datasets: []
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 100,
                precision: 0,
                autoSkip: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Average'
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: '# Games'
              }
            }
          ]
        }
      }
    });

  }
}
