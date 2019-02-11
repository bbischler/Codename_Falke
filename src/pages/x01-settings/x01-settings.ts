import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
  doubleIn: Boolean = true;
  doubleOut: Boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  play() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad X01SettingsPage');
  }
  addPlayer() {
    this.playernumber.push(this.playernumber.length + 1);
  }
  removePlayer() {
    this.playernumber.splice(-1, 1);
  }
}
