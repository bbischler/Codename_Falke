import { Player } from '../../models/player';
import { Injectable } from '@angular/core';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {
  activePage: string = 'Home';
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

  setPlayer(name: string) {
    this.players.push(new Player(this.players.length, name));
  }
  getAllPlayer() {
    return this.players;
  }
  setGameIsActive(isactive: Boolean) {
    this.gameIsActive = isactive;
  }
  getGameIsActive() {
    return this.gameIsActive;
  }
}
