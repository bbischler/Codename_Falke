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

  constructor(private http: HttpClient, public alertController: AlertController, public toastController: ToastController) {
    this.setAppSettings();
  }

  getActivePage() {
    return this.activePage;
  }
  setActivePage(page) {
    this.activePage = page;
  }
  setX01Settings(settings: X01Settings) {
    this.x01Settings = settings;
    localStorage.setItem("doubleOutGame", JSON.stringify(this.x01Settings.doubleOut));
  }

  resetX01Settings() {
    this.x01Settings = new X01Settings(false, 3, 1, false, true);
    localStorage.removeItem("doubleOutGame");
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
      }],
      enableBackdropDismiss: false
    });
    await alert.present();
    return promise;
  }

  // TOASTS
  async toastPopup(cssClass, message) {
    const toast = await this.toastController.create({
      cssClass: cssClass,
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }



}
