import { Player } from '../../models/player';
import { X01Settings } from '../../models/x01Settings';
import { Injectable } from '@angular/core';

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

  constructor() {
    console.log('Hello ServiceProvider Provider');
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
