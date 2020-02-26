import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController, Platform, ModalOptions, Modal } from 'ionic-angular';
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Chart } from "chart.js";
import { X01stats } from "../../models/x01/x01stats";
import { X01Player } from "../../models/x01/x01Player";
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
  @ViewChild("lineCanvasThrow") lineCanvasThrow: ElementRef;
  @ViewChild("lineCanvasFirstNine") lineCanvasFirstNine: ElementRef;
  @ViewChild("barCanvas") barCanvas: ElementRef;


  pageName = 'MODAL';
  private lineChart: Chart;
  private lineChartThrow: Chart;
  private lineChartFirstNine: Chart;
  private barChart: Chart;

  game: X01stats;
  labels: String[] = [];
  labelXAxis: String = "";
  colors: String[] = ["rgba(28, 250, 162, 0.8)", "rgba(66, 149, 229, 0.8)", "rgba(228, 54, 54, 0.8)", "rgba(216, 243, 64, 0.8)",
    "rgba(61, 6, 157, 0.8)", "rgba(220, 224, 218, 0.9)", "", "rgba(220, 85, 247, 0.8)"];

  constructor(public platform: Platform, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.game = navParams.get('game');
    console.log(this.game);
  }

  ionViewDidLoad() {
    this.labelXAxis = "# Games";
    for (let i = 1; i < this.game.players[0].avgPerLeg.length + 1; i++) {
      this.labels.push(i.toString());
    }

    this.avgPointsLINE();
    this.firstNineLINE();
    this.throwsPerGameLINE();
    this.totalPointsPerGameBAR();
  }

  getTotalScore(scores: number[]) {
    let total = 0;
    for (let t of scores) {
      total += t;
    }
    return total;
  }

  isWinner(p: X01Player) {
    let allScores: number[] = [];
    for (let p of this.game.players) {
      allScores.push(p.totalScoreForAllGames);
    }
    return Math.max(...allScores) == p.totalScoreForAllGames;
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }


  // Fill Charts //
  avgPointsLINE() {
    this.drawAvgPoints();
    for (let i = 0; i < this.game.players.length; i++) {

      this.lineChart.data.datasets[i] = (
        {
          label: this.game.players[i].name,
          fill: false,
          lineTension: 0.1,
          backgroundColor: this.colors[i],
          borderColor: this.colors[i],
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: this.colors[i],
          pointBackgroundColor: this.colors[i],
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: this.colors[i],
          pointHoverBorderColor: this.colors[i],
          pointHoverBorderWidth: 2,
          pointRadius: (this.game.players[0].avgPerLeg.length == 1) ? 7 : 5,
          pointHitRadius: 10,
          data: this.game.players[i].avgPerLeg,
          spanGaps: true
        }
      );
      this.lineChart.update();
    }
  }
  firstNineLINE() {
    this.drawFirstNine();
    for (let i = 0; i < this.game.players.length; i++) {

      let firstNineAvg: any[] = [];
      for (let scores of this.game.players[i].firstNinePerLeg) {
        let tmpScore = 0;
        for (let j = 0; j < 9; j++) {
          tmpScore += ((scores[j]) ? scores[j] : 0);
        }
        firstNineAvg.push((tmpScore / 9).toFixed(2));
      }

      this.lineChartFirstNine.data.datasets[i] = (
        {
          label: this.game.players[i].name,
          fill: false,
          lineTension: 0.1,
          backgroundColor: this.colors[i],
          borderColor: this.colors[i],
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: this.colors[i],
          pointBackgroundColor: this.colors[i],
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: this.colors[i],
          pointHoverBorderColor: this.colors[i],
          pointHoverBorderWidth: 2,
          pointRadius: (this.game.players[0].avgPerLeg.length == 1) ? 7 : 5,
          pointHitRadius: 10,
          data: firstNineAvg,
          spanGaps: true
        }
      );
      this.lineChartFirstNine.update();
    }
  }
  throwsPerGameLINE() {
    this.drawTotalThrows();
    for (let i = 0; i < this.game.players.length; i++) {

      this.lineChartThrow.data.datasets[i] = (
        {
          label: this.game.players[i].name,
          fill: false,
          lineTension: 0.1,
          backgroundColor: this.colors[i],
          borderColor: this.colors[i],
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: this.colors[i],
          pointBackgroundColor: this.colors[i],
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: this.colors[i],
          pointHoverBorderColor: this.colors[i],
          pointHoverBorderWidth: 2,
          pointRadius: (this.game.players[0].avgPerLeg.length == 1) ? 7 : 5,
          pointHitRadius: 10,
          data: this.game.players[i].totalThrowsPerLeg,
          spanGaps: true
        }
      );
      this.lineChartThrow.update();
    }
  }
  totalPointsPerGameBAR() {
    this.drawTotalPoints();
    for (let i = 0; i < this.game.players.length; i++) {

      this.barChart.data.datasets[i] = (
        {
          label: this.game.players[i].name,
          backgroundColor: this.colors[i],
          borderColor: this.colors[i],
          borderWidth: 1,
          data: this.game.players[i].totalPointsPerLeg,
        }
      );
      this.barChart.update();
    }
  }


  // Chart Setup //
  drawAvgPoints() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      options: {
        legend: {
          position: 'bottom'
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              // stepSize: 20,
              autoSkipPadding: 30,
              precision: 0,
              autoSkip: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'Average'
            }
          }],
          xAxes: [{
            offset: true,
            scaleLabel: {
              display: true,
              labelString: this.labelXAxis
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
  drawFirstNine() {
    this.lineChartFirstNine = new Chart(this.lineCanvasFirstNine.nativeElement, {
      type: "line",
      options: {
        legend: {
          position: 'bottom'
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              // stepSize: 20,
              autoSkipPadding: 30,
              precision: 0,
              autoSkip: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'Avg First Nine'
            }
          }],
          xAxes: [{
            offset: true,
            scaleLabel: {
              display: true,
              labelString: this.labelXAxis
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
  drawTotalThrows() {
    this.lineChartThrow = new Chart(this.lineCanvasThrow.nativeElement, {
      type: "line",
      options: {
        legend: {
          position: 'bottom'
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              // stepSize: 20,
              autoSkipPadding: 30,
              precision: 0,
              autoSkip: true,
            },
            scaleLabel: {
              display: true,
              labelString: '# Throws'
            }
          }],
          xAxes: [{
            offset: true,
            scaleLabel: {
              display: true,
              labelString: this.labelXAxis
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
  drawTotalPoints() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: this.labels,
        datasets: []
      },
      options: {
        legend: {
          position: 'bottom'
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                autoSkipPadding: 30,
                precision: 0,
                autoSkip: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Total Points'
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
                labelString: this.labelXAxis
              }
            }
          ]
        }
      }
    });

  }
}
