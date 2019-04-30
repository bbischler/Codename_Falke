import { Player } from '../../models/player';
import { X01Settings } from '../../models/x01Settings';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {
  activePage: string = 'Home';
  x01Settings: X01Settings = new X01Settings(false, 3, 1, true, false);
  players: Player[] = [];
  gameIsActive: Boolean = false;
  checkoutTable = new Map();

  constructor(private http: HttpClient) {
    console.log('Hello ServiceProvider Provider');
    this.getCheckoutTable();

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
}
