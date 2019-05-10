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
    this.players.push(new CricketPlayer(1, "Player 1"));
    this.players.push(new CricketPlayer(2, "Player 2"));
  }

  dismiss() {
    this.viewCtrl.dismiss(false);
  }
  play() {
    for (let i = 0; i < this.players.length; i++) {
      this.service.addPlayer(this.players[i]);
    }
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
      this.players.push(new CricketPlayer(newPlayerNumber, "Player " + newPlayerNumber));
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
    const toast = await this.toastController.create({
      cssClass: "playerToast",
      message: 'Maximum eight player allowed',
      duration: 2500,
      position: 'top'
    });
    toast.present();
  }

  async presentToastMinPlayer() {
    const toast = await this.toastController.create({
      cssClass: "playerToast",
      message: 'Minimum one player required',
      duration: 2500,
      position: 'top'
    });
    toast.present();
  }
}
