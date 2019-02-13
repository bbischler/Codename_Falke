import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-cricket-settings',
  templateUrl: 'cricket-settings.html',
})
export class CricketSettingsPage {
  playernumber: any = [1, 2];
  players: string[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private service: ServiceProvider) {
    this.players.push("Player 1");
    this.players.push("Player 2");
  }

  dismiss() {
    this.viewCtrl.dismiss(true);
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
}
