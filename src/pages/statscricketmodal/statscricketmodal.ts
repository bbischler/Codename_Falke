import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, Platform, ViewController, ModalOptions, Modal } from 'ionic-angular';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from "@angular/core";
import { Chart } from "chart.js";
import { X01stats } from "../../models/x01/x01stats";
import { Cricketstats } from '../../models/cricket/cricketstats';
import { CricketPlayer } from '../../models/cricket/cricketPlayer';

/**
 * Generated class for the StatsmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statscricketmodal',
  templateUrl: 'statscricketmodal.html',
})
export class StatscricketmodalPage {

  @ViewChild("lineCanvas") lineCanvas: ElementRef;
  @ViewChild("lineCanvasAvg") lineCanvasAvg: ElementRef;
  @ViewChildren("yourId") myChartsCanvas: QueryList<any>;


  pageName = 'MODAL';
  private lineChart: Chart;
  private lineChartAvg: Chart;
  private charts: Chart[] = [];
  // private barChart: Chart;

  game: Cricketstats;
  colors: String[] = ["rgba(28, 250, 162, 0.8)", "rgba(66, 149, 229, 0.8)", "rgba(228, 54, 54, 0.8)", "rgba(216, 243, 64, 0.8)",
    "rgba(61, 6, 157, 0.8)", "rgba(220, 224, 218, 0.9)", "", "rgba(220, 85, 247, 0.8)"];
  labelsCricketPoints: String[] = ["20", "19", "18", "17", "16", "15", "Bull"];
  labelsGame: String[] = [];

  constructor(public platform: Platform, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.game = navParams.get('game');
  }

  ionViewDidLoad() {
    for (let i = 1; i < this.game.players[0].totalScoresPerGame.length + 1; i++) {
      this.labelsGame.push(i.toString());
    }

    this.setLineChart();
    this.setLineChartAvg();
    for (let i = 0; i < this.myChartsCanvas.length; i++) {
      this.setBarTotalScore(i);
    }
  }
  getTotalScore(player: CricketPlayer) {
    let totalScore: number = 0;
    for (let score of player.totalScoresPerGame)
      totalScore += score;
    return totalScore;
  }

  isWinner(p: CricketPlayer) {
    let allScores: number[] = [];
    for (let player of this.game.players) {
      allScores.push(this.getTotalScore(player));
    }
    return Math.max(...allScores) == this.getTotalScore(p);
  }

  setLineChart() {
    this.drawLineChart();
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
          pointRadius: 5,
          pointHitRadius: 10,
          data: this.game.players[i].totalScoresPerGame,
          spanGaps: true
        }
      );
      this.lineChart.update();
    }
  }
  setBarTotalScore(j: number) {
    this.drawBarChart(j);
    for (let i = 0; i < this.game.players.length; i++) {
      let hits: String[] = [];
      for (let point of this.game.players[i].pointsPerGame[j]) {
        hits.push(point.hitCount.toString());
      }

      // for (let i = 0; i < this.game.players.length; i++) {
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

  setLineChartAvg() {
    this.drawLineChartAvg();
    for (let i = 0; i < this.game.players.length; i++) {


      this.lineChartAvg.data.datasets[i] = (
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
          data: this.game.players[i].avgPerGame,
          spanGaps: true
        }
      );
      this.lineChartAvg.update();
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
              autoSkipPadding: 30,
              precision: 0,
              autoSkip: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'Points'
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
        labels: this.labelsGame,
        datasets: []
      }
    });
  }
  drawLineChartAvg() {
    this.lineChartAvg = new Chart(this.lineCanvasAvg.nativeElement, {
      type: "line",
      options: {
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
              labelString: 'Hitrate %'
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
        labels: this.labelsGame,
        datasets: []
      }
    });
  }
  drawBarChart(i: number) {
    let array = this.myChartsCanvas.toArray();
    this.charts[i] = new Chart(array[i].nativeElement, {
      type: "bar",
      data: {
        labels: this.labelsCricketPoints,
        datasets: []
      },
      options: {
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



  closeModal() {
    this.viewCtrl.dismiss();
  }
}
