import { CricketPlayer } from './../../models/cricketPlayer';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-cricket-settings',
  templateUrl: 'cricket-settings.html',
})
export class CricketSettingsPage {
  players: CricketPlayer[] = [];
  pageName = 'MODAL';


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, private service: ServiceProvider,
    public toastController: ToastController) {

    if (localStorage.getItem("cricketPlayer")) {
      let tmpplayers = JSON.parse(localStorage.getItem("cricketPlayer"));
      console.log("tmpplaers: " + tmpplayers);
      for (let p of tmpplayers) {
        this.players.push(new CricketPlayer(p.id, p.name));
      }
    }
    else {
      this.players.push(new CricketPlayer(1, ""));
      this.players.push(new CricketPlayer(2, ""));
    }

  }

  dismiss() {
    this.viewCtrl.dismiss(false);
  }

  play() {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].name == "") {
        this.players[i].name = "Player " + (i + 1);
      }
      // this.players[i].setId(i);
      this.service.addPlayer(this.players[i]);
    }
    localStorage.setItem("cricketPlayer", JSON.stringify(this.players));
    this.viewCtrl.dismiss(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad X01SettingsPage');
  }

  addPlayer() {
    if (this.players.length == 8) {
      this.presentToastMaxPlayer();
    } else {
      var newPlayerNumber = this.players.length + 1;
      this.players.push(new CricketPlayer(newPlayerNumber, ""));
    }
  }

  removePlayer() {
    if (this.players.length == 1) {
      this.presentToastMinPlayer();
    } else {
      this.players.splice(-1, 1);
    }
  }

  async presentToastMaxPlayer() {
    this.service.toastPopup('playerToast', 'Maximum eight player');
  }

  async presentToastMinPlayer() {
    this.service.toastPopup('playerToast', 'Minimum one player');
  }
}