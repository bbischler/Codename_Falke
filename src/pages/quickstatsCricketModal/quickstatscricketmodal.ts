import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, Platform, ViewController } from 'ionic-angular';
import { Component } from "@angular/core";
import { CricketPlayer } from '../../models/cricket/cricketPlayer';

/**
 * Generated class for the StatsmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quickstatscricketmodal',
  templateUrl: 'quickstatscricketmodal.html',
})
export class QuickstatsCricketModalPage {

  pageName = 'MODAL';
  containerofThree: number[] = [3, 2, 1];

  players: CricketPlayer[] = [];
  constructor(public platform: Platform, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.players = navParams.get('players');
    console.log(this.players);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
