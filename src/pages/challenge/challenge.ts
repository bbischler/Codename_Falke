import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ServiceProvider } from '../../providers/service/service';
/**
 * Generated class for the ChallengePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-challenge',
  templateUrl: 'challenge.html',
})
export class ChallengePage {
  score: string;
  avg: number = 0;
  lastavg: number = 0;
  throwCounter: number = 0;
  hitCounter: number = 0;
  hardmode: boolean = false;
  propability = 5;
  points: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 19, 19, 19, 20, 20, 20, 25, 25];
  constructor(public navCtrl: NavController, public navParams: NavParams, private service: ServiceProvider) {
    this.resetAll();
    this.getRandomPoints();
    let storedAvg = JSON.parse(localStorage.getItem('challengeAvg'));
    console.log(storedAvg);
    this.lastavg = (storedAvg ? storedAvg : 0);
    console.log(this.lastavg);
  }

  ionViewDidEnter() {
    this.service.setActivePage("Challenge");
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChallengePage');
  }

  ionViewWillLeave(){
    localStorage.setItem('challengeAvg', JSON.stringify(this.lastavg));
  }
  getRandomPoints() {
    var rand = this.points[Math.floor(Math.random() * this.points.length)];
    this.score = rand.toString();
    var rand1 = Math.floor(Math.random() * 100);
    if (rand1 < this.propability)
      this.score = "D" + this.score;
    else if (rand1 < this.propability * 2)
      if (rand != 25)
        this.score = "T" + this.score;
  }


  clickmode(value: boolean) {
    this.hardmode = value;
    console.log(this.hardmode);
    this.resetAll();
  }

  resetAll() {
    this.avg = 0;
    this.hitCounter = 0;
    this.throwCounter = 0;
    if (this.hardmode) {
      this.propability = 15;
    } else {
      this.propability = 2;
    }
  }

  throw(hit: boolean) {
    this.throwCounter++;

    if (hit == true)
      this.hitCounter++;

    let tmpavg = ((this.hitCounter / this.throwCounter) * 100).toFixed(1);
    this.avg = parseFloat(tmpavg);
    this.getRandomPoints();
  }

  newgame() {
    this.lastavg = this.avg;
    this.resetAll();
    this.getRandomPoints();
  }

  endgame() {
    this.lastavg = this.avg;
    localStorage.setItem('challengeAvg', JSON.stringify(this.lastavg));
    this.resetAll();
    this.navCtrl.push(HomePage, {}, { animate: true, direction: 'forward' });

  }
}
