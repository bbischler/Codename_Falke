import { Component } from '@angular/core';
import { ViewController, Platform, NavParams } from 'ionic-angular';
import { CricketPlayer } from '../../models/cricket/cricketPlayer';
/**
 * Generated class for the Quickstatsx01Component component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'quickstatscricket',
  templateUrl: 'quickstatscricket.html'
})
export class QuickstatscricketComponent {
  pageName = 'POPOVER';
  players: CricketPlayer[] = [];

  constructor(public platform: Platform, public viewCtrl: ViewController, public navParams: NavParams) {
    this.players = this.navParams.get('key1');
  }

  // closeModal() {
  //   this.viewCtrl.dismiss();
  // }

  isWinner(p: CricketPlayer) {
    let allScores: number[] = [];
    for (let p of this.players) {
      allScores.push(p.totalScore);
    }
    return Math.max(...allScores) == p.totalScore;
  }
}
