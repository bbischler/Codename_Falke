import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Player } from '../../models/player';

/**
 * Generated class for the CricketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cricket',
  templateUrl: 'cricket.html',
})
export class CricketPage {

  players: Player[] = [];
  isDouble: Boolean = false;
  isTriple: Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CricketPage');
    this.players.push(new Player(0, "basti", 0));
    this.players.push(new Player(1, "marco", 0));
    this.players.push(new Player(2, "tim", 0));
    this.players.push(new Player(3, "patrick", 0));
  }

  addPoints(points: number, id: number) {
    if (this.isDouble) {
      points = points * 2;
    }
    if (this.isTriple) {
      points = points * 3;
    }
    this.players[id].setScore(points);
    this.isDouble = false;
    this.isTriple = false;
  }
  undo() {
    console.log("undo");
  }
  newgame() {
    console.log("newgame");
  }
  double() {
    this.isTriple = false;
    this.isDouble = !this.isDouble;
  }
  trible() {
    this.isDouble = false;
    this.isTriple = !this.isTriple;
  }

}
