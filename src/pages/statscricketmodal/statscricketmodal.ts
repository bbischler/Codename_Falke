import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ModalOptions, Modal } from 'ionic-angular';
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Chart } from "chart.js";
import { X01stats } from "../../models/x01stats";
import { Cricketstats } from '../../models/cricketstats';

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
  @ViewChild("barCanvas") barCanvas: ElementRef;


  pageName = 'MODAL';
  private lineChart: Chart;
  private barChart: Chart; 

  game: Cricketstats;
  colors: String[] = ["rgb(28, 230, 162)", "rgb(50, 130, 162)", "rgb(28, 200, 62)", "rgb(128, 130, 162)", "rgb(128, 230, 62)", "rgb(68, 80, 62)", "", "rgb(28, 0, 162)"];
  labels: String[] = ["20", "19", "18", "17", "16", "15", "Bull"];
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.game = navParams.get('game');
    console.log(this.game);
  }

  ionViewDidLoad() {
    this.setBarTotalScore();
  }


  setBarTotalScore() {
    this.drawBarChart();
    for (let i = 0; i < this.game.players.length; i++) {
      let hits: String[] = [];
      for (let point of this.game.players[i].points) {
        hits.push(point.hitCount.toString());
      }
      this.barChart.data.datasets[i] = (
        {
          label: this.game.players[i].name,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: this.colors[i],
          borderWidth: 1,
          data: hits,
        }
      );
      this.barChart.update();
    }
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
                beginAtZero: true
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
    this.navCtrl.pop();
  }
}
