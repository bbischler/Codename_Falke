import { Component } from '@angular/core';
import { ViewController, Platform, NavParams } from 'ionic-angular';
import { X01Player } from '../../models/x01/x01Player';
/**
 * Generated class for the Quickstatsx01Component component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'quickstatsx01',
  templateUrl: 'quickstatsx01.html'
})
export class Quickstatsx01Component {
  pageName = 'POPOVER';
  players: X01Player[] = [];
  currentLeg: number = 1;
  currentSet: number = 1;
  isLegbased: Boolean = false;

  constructor(public platform: Platform, public viewCtrl: ViewController, public navParams: NavParams) {
    this.players = this.navParams.get('key1');
    this.currentLeg = this.navParams.get('key2');
    this.currentSet = this.navParams.get('key3');
    this.isLegbased = this.navParams.get('key4');
  }

  // closeModal() {
  //   console.log("close popover");
  //   this.viewCtrl.dismiss();
  // }

  isWinner(p: X01Player) {
    let allScores: number[] = [];
    for (let p of this.players) {
      allScores.push(p.totalScore);
    }
    return Math.min(...allScores) == p.totalScore;
  }
}
