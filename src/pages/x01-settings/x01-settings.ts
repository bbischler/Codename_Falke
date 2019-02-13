import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the X01SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-x01-settings',
  templateUrl: 'x01-settings.html',
})
export class X01SettingsPage {
  playernumber: any = [1, 2];
  doubleIn: Boolean = false;
  doubleOut: Boolean = true;
  legbased: Boolean = false;
  legs: number;
  sets: number;
  players: string[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private service: ServiceProvider) {
    this.players.push("Player 1");
    this.players.push("Player 2");
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  play() {
    for (let i = 0; i < this.players.length; i++) {
      this.service.setPlayer(this.players[i]);
    }
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad X01SettingsPage');
  }
  addPlayer() {
    this.players.push("Player " + (this.players.length + 1));
    this.playernumber.push(this.playernumber.length);
  }

  removePlayer() {
    this.playernumber.splice(-1, 1);
    this.players.splice(-1, 1);
  }
  quickgame() {
    this.legbased = false;
  }
  legbasedgame() {
    this.legbased = true;
  }
}
