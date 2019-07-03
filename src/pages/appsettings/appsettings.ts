import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the AppsettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-appsettings',
  templateUrl: 'appsettings.html',
})
export class AppsettingsPage {

  vibrate: boolean = true;
  sound: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, private service: ServiceProvider) {
    let settings = JSON.parse(localStorage.getItem('appsettings'));
    if (settings) {
      console.log("settings sind gespeichert");
      this.vibrate = settings.vibrate;
      this.sound = settings.sound;
    }
  }
  ionViewDidEnter() {
    this.service.setActivePage("Settings");
  }
  soundon() {
    this.sound = true;
  }
  soundoff() {
    this.sound = false;
  }
  vibrateon() {
    this.vibrate = true;
  }
  vibrateoff() {
    this.vibrate = false;
  }
  save() {
    localStorage.removeItem('appsettings');
    localStorage.setItem('appsettings', JSON.stringify({
      "sound": this.sound,
      "vibrate": this.vibrate
    }));
    this.navCtrl.pop();
  }
}
