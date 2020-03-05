import { IonicPage, NavController, NavParams, Card } from 'ionic-angular';
import { ModalController, ViewController, Platform, ModalOptions, Modal } from 'ionic-angular';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from "@angular/core";
import { Chart } from "chart.js";
import { Bobstats } from "../../models/bob/bobstats";
import { bobPlayer } from "../../models/bob/bobPlayer";
/**
 * Generated class for the StatsmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statsBobmodal',
  templateUrl: 'statsBobmodal.html',
})
export class StatsBobmodalPage {

  @ViewChild("lineCanvas") lineCanvas: ElementRef;
  @ViewChildren("yourId") myChartsCanvas: QueryList<any>;
  @ViewChild("lineCanvasTotal") lineCanvasTotal: ElementRef;

  pageName = 'MODAL';
  private lineChart: Chart;
  private charts: Chart[] = [];
  private lineChartTotal: Chart;

  game: Bobstats;
  labelsGames: String[] = [];
  labelsPoints: String[] = [];
  xAxisGames: String = "# Games";
  xAxisPoints: String = "Points";

  colors: String[] = ["rgba(28, 250, 162, 0.8)", "rgba(66, 149, 229, 0.8)", "rgba(228, 54, 54, 0.8)", "rgba(216, 243, 64, 0.8)",
    "rgba(61, 6, 157, 0.8)", "rgba(220, 224, 218, 0.9)", "", "rgba(220, 85, 247, 0.8)"];

  constructor(public platform: Platform, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.game = navParams.get('game');
  }

  ionViewDidLoad() {
    for (let i = 1; i < this.game.players[0].pointCounterPerGame.length + 1; i++) {
      this.labelsGames.push(i.toString());
    }

    for (let i = 1; i < 21 + 1; i++) {
      if (i == 21)
        this.labelsPoints.push("Bull");
      else
        this.labelsPoints.push(i.toString());
    }
    this.setLineChartTotal();
    this.avgPointsLINE();
    for (let i = 0; i < this.myChartsCanvas.length; i++) {
      this.ThrowsPerPoint(i);
    }
  }

  ThrowsPerPoint(j: number) {

    this.drawThrowsPerPoint(j);
    for (let i = 0; i < this.game.players.length; i++) {
      // this.chart.data.datasets[i] = (

      let hits: number[] = [];
      for (let m = 0; m < this.game.players[i].pointCounterPerGame[j].length; m++) {
        hits[m] = 3 - this.game.players[i].pointCounterPerGame[j][m];
      }

      this.charts[j].data.datasets[i] = (
        {
          label: this.game.players[i].name,
          backgroundColor: this.colors[i],
          borderColor: this.colors[i],
          borderWidth: 1,
          data: hits,
        }
      );
      this.charts[j].update();
    }
  }

  drawThrowsPerPoint(i: number) {
    let array = this.myChartsCanvas.toArray();
    this.charts[i] = new Chart(array[i].nativeElement, {
      type: "bar",
      data: {
        labels: this.labelsPoints,
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
                autoSkipPadding: 30,
                beginAtZero: true,
                precision: 0
              },
              scaleLabel: {
                display: true,
                labelString: 'Hits'
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Points'
              }
            }
          ]
        }
      }
    });
  }
  add(a, b) {
    return a + b;
  }
  getTotalScore(scores: number[]) {
    return scores.reduce((a, b) => a + b, 0);
  }

  isWinner(player: bobPlayer) {
    let allScores: number[] = [];
    for (let p of this.game.players) {
      allScores.push(this.getTotalScore(p.totalScoresPerGame));
    }
    return Math.max(...allScores) == this.getTotalScore(player.totalScoresPerGame);
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
          pointRadius: (this.game.players[0].pointCounterPerGame.length == 1) ? 7 : 5,
          pointHitRadius: 10,
          data: this.game.players[i].avgPerGame,
          spanGaps: true
        }
      );
      this.lineChart.update();
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
              labelString: 'Average %'
            }
          }],
          xAxes: [{
            offset: true,
            scaleLabel: {
              display: true,
              labelString: this.xAxisGames
            }
          }]
        }
      },
      data: {
        labels: this.labelsGames,
        datasets: []
      }
    });
  }


  setLineChartTotal() {
    this.drawLineChartTotal();
    for (let i = 0; i < this.game.players.length; i++) {


      this.lineChartTotal.data.datasets[i] = (
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
          pointRadius: 5,
          pointHitRadius: 10,
          data: this.game.players[i].totalScoresPerGame,
          spanGaps: true
        }
      );
      this.lineChartTotal.update();
    }
  }

  drawLineChartTotal() {
    this.lineChartTotal = new Chart(this.lineCanvasTotal.nativeElement, {
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
              autoSkipPadding: 30,
              precision: 0,
              autoSkip: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'Score'
            }
          }],
          xAxes: [{
            offset:true,
            scaleLabel: {
              display: true,
              labelString: '# Games'
            }
          }]
        }
      },
      data: {
        labels: this.labelsGames,
        datasets: []
      }
    });
  }
}
