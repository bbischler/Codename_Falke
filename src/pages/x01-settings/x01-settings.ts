import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { HomePage } from '../../pages/home/home';
import { X01Player } from '../../models/x01Player';

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
  doubleIn: Boolean = false;
  doubleOut: Boolean = true;
  legbased: Boolean = false;
  legs: number;
  sets: number;
  players: X01Player[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private service: ServiceProvider) {
    this.players.push(new X01Player(1, "Player 1"));
    this.players.push(new X01Player(2, "Player 2"));
  }

  dismiss() {
    this.service.setActivePage('Home');
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
    this.players.push(new X01Player(newPlayerNumber, "Player " + newPlayerNumber));
  }

  removePlayer() {
    this.players.splice(-1, 1);
  }
  quickgame() {
    this.legbased = false;
  }
  legbasedgame() {
    this.legbased = true;
  }
}
