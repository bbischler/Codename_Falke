import { CricketPlayer } from './../../models/cricketPlayer';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-cricket-settings',
  templateUrl: 'cricket-settings.html',
})
export class CricketSettingsPage {
  players: CricketPlayer[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private service: ServiceProvider) {
    this.players.push(new CricketPlayer(1, "Player 1"));
    this.players.push(new CricketPlayer(2, "Player 2"));
  }

  dismiss() {
    this.viewCtrl.dismiss(true);
  }
  play() {
    for (let i = 0; i < this.players.length; i++) {
      this.service.addPlayer(this.players[i]);
    }
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad X01SettingsPage');
  }
  addPlayer() {
    var newPlayerNumber = this.players.length + 1;
    this.players.push(new CricketPlayer(newPlayerNumber, "Player " + newPlayerNumber));
  }

  removePlayer() {
    this.players.splice(-1, 1);
  }
}
