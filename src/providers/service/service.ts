import { Player } from '../../models/player';
import { X01Player } from '../../models/x01Player';
import { X01Settings } from '../../models/x01Settings';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController } from 'ionic-angular';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {
  activePage: string = 'Home';
  x01Settings: X01Settings = new X01Settings(false, 3, 1, false, true);
  players: Player[] = [];
  gameIsActive: Boolean = false;
  checkoutTable = new Map();

  constructor(private http: HttpClient, public alertController: AlertController, public toastController: ToastController) {
    console.log('Hello ServiceProvider Provider');
    this.getCheckoutTable();
    this.setAppSettings();
  }
  getCheckoutTable() {
    this.http.get('../../assets/checkoutTable.csv', { responseType: 'text' })
      .subscribe(
        data => {
          data = data.replace(/(\r\n|\n|\r)/gm, "Y");
          var lines = data.split('Y');
          for (let line of lines) {
            var arr = line.split(';');
            let score = parseInt(arr[0]);
            this.setCheckOutTable(score, arr[1]);
          }

        },
        error => {
          console.log(error);
        }
      );

  }
  setCheckOutTable(key: number, value: String) {
    this.checkoutTable.set(key, value);
  }


  getCheckOut(num) {
    if (this.checkoutTable.get(num)) {
      return this.checkoutTable.get(num);
    }
  }

  getActivePage() {
    return this.activePage;
  }
  setActivePage(page) {
    this.activePage = page;
  }
  setX01Settings(settings: X01Settings) {
    this.x01Settings = settings;
    console.log(JSON.stringify(this.x01Settings));
  }
  getX01Settings() {
    return this.x01Settings;
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }
  getAllPlayer() {
    return this.players;
  }
  setGameIsActive(isactive: Boolean) {
    console.log("game: " + isactive);
    this.gameIsActive = isactive;
  }
  getGameIsActive() {
    return this.gameIsActive;
  }
  deletePlayers() {
    console.log("delete players");
    this.players = [];
  }
  setAppSettings() {
    if (!JSON.parse(localStorage.getItem('appsettings'))) {
      console.log("appsettings in service NICHT gesetz");
      localStorage.setItem('appsettings', JSON.stringify({
        "sound": true,
        "vibrate": true
      }));
    }
  }
  getAppSettings() {
    return JSON.parse(localStorage.getItem('appsettings'));
  }

  getObjectOfPlayer(p) {
    let tmpPlayer = new X01Player()
    Object.assign(tmpPlayer, {
      "roundScore": p.roundScore,
      "avg": p.avg,
      "toThrow": p.toThrow,
      "lastThreeScores": p.lastThreeScores,
      "legs": p.legs,
      "sets": p.sets,
      "doubleIn": p.doubleIn,
      "doubleOut": p.doubleIn,
      "id": p.id,
      "name": p.name,
      "totalScore": p.totalScore,
      "roundThrowCount": p.roundThrowCount,
      "totalThrowCount": p.totalThrowCount
    });
    return tmpPlayer;
  }

  // POPUPS
  async showMessageOkCancel(title, message, buttons) {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<Boolean>(resolve => {
      resolveFunction = resolve;
    });
    const alert = await this.alertController.create({
      title: title,
      message: message,
      buttons: [{
        text: buttons[0],
        handler: () => resolveFunction(false)
      }, {
        text: buttons[1],
        handler: () => resolveFunction(true)
      }]
    });
    await alert.present();
    return promise;
  }

  // TOASTS
  async toastPopup(cssClass, message) {
    const toast = await this.toastController.create({
      cssClass: cssClass,
      message: message,
      duration: 2500,
      position: 'top'
    });
    toast.present();
  }



}
