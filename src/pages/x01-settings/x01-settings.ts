import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { DataProvider } from '../../providers/data/data';

import { X01Player } from '../../models/x01Player';
import { X01Settings } from '../../models/x01Settings';
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
  x01Settings: X01Settings;
  players: X01Player[] = [];
  pageName = 'MODAL';
  gameNum: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, private service: ServiceProvider,
    public toastController: ToastController, public data: DataProvider) {
    this.x01Settings = this.service.getX01Settings();
    // this.gameNum = navParams.get('gameNum');
    if (localStorage.getItem("x01Player")) {
      let tmpplayers = JSON.parse(localStorage.getItem("x01Player"));
      for (let p of tmpplayers) {
        this.players.push(new X01Player(this.data, p.id, p.name));
      }
    }
    else {
      this.players.push(new X01Player(this.data, 1, ""));
      this.players.push(new X01Player(this.data, 2, ""));
    }
  }

  resetSettings() {
    this.service.resetX01Settings();
    this.x01Settings = this.service.getX01Settings();
    this.players = [];
    localStorage.removeItem("x01Player");
    this.players.push(new X01Player(this.data, 1, ""));
    this.players.push(new X01Player(this.data, 2, ""));
  }

  dismiss() {
    this.service.setActivePage('Home');
    this.viewCtrl.dismiss(false);
  }
  play() {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].name == "") {
        this.players[i].name = "Player " + (i + 1);
      }
      this.service.addPlayer(this.players[i]);
    }
    this.service.setX01Settings(this.x01Settings);
    localStorage.setItem("x01Player", JSON.stringify(this.players));

    this.viewCtrl.dismiss(true);
  }

  addPlayer() {
    if (this.players.length == 8) {
      this.presentToastMaxPlayer();
    } else {
      var ids: number[] = [];
      this.players.forEach(function (player) {
        ids.push(player.id);
      });
      let newId = Math.max(...ids) + 1;
      this.players.push(new X01Player(this.data, newId, ""));
    }
  }

  removePlayer(id: number) {
    if (this.players.length == 1) {
      this.presentToastMinPlayer();
    } else {
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].id == id) {
          this.players.splice(i, 1);
          return;
        }
      }
    }
  }
  quickgame() {
    this.x01Settings.legbased = false;
  }
  legbasedgame() {
    this.x01Settings.legbased = true;
  }

  setNum(num: number) {
    this.x01Settings.num = num;
  }

  async presentToastMaxPlayer() {
    this.service.toastPopup('playerToast', 'Maximum eight player');
  }

  async presentToastMinPlayer() {
    this.service.toastPopup('playerToast', 'Minimum one player');
  }
}
