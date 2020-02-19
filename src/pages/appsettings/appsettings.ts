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
    this.getSettings();
  }
  ionViewDidEnter() {
    this.service.setActivePage('Settings');
  }

  deleteCachePopup() {
    this.service.showMessageOkCancel('Delete Cache?', 'Deleting the cache will delete all saved data, including stats, stored games, players and any game-settings', ['Cancel', 'Yes']).then((res) => {
      if (res) {
        this.deleteCache();
      } else {
        return;
      }
    });
  }

  deleteCache() {
    localStorage.removeItem('appsettings');
    localStorage.removeItem('challengeAvg');
    localStorage.removeItem('cricketPlayer');
    localStorage.removeItem('cricketstats');
    localStorage.removeItem('cricketStorage');
    localStorage.removeItem('cricketStack');
    localStorage.removeItem('x01Player');
    localStorage.removeItem('x01stats');
    localStorage.removeItem('x01Storage');
    localStorage.removeItem('x01Storage301');
    localStorage.removeItem('x01Storage501');
    localStorage.removeItem('x01Storage701');
    localStorage.removeItem('x01Stack');
    localStorage.removeItem('x01Stack301');
    localStorage.removeItem('x01Stack501');
    localStorage.removeItem('x01Stack701');
    localStorage.removeItem('doubleOutGame');
    this.service.setAppSettings();
    this.service.resetX01Settings();
    this.service.deletePlayers()
    this.getSettings();
    this.service.toastPopup('playerToastBust', 'Cache Deleted!');
  }
  getSettings() {
    let settings = JSON.parse(localStorage.getItem('appsettings'));
    if (settings) {
      console.log('settings sind gespeichert');
      this.vibrate = settings.vibrate;
      this.sound = settings.sound;
    }
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
      'sound': this.sound,
      'vibrate': this.vibrate
    }));
    this.navCtrl.pop();
  }
}
