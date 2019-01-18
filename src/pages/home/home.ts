import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CricketPage } from '../cricket/cricket';
import { X01Page } from '../x01/x01';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  openCricket() {
    console.log('open cricket');
    this.navCtrl.push(CricketPage);
  }
  openX01(num: number) {
    this.navCtrl.push(X01Page, {
      param: num
    });
  }
  openInstructions() {
    console.log('open instructions');
  }
  inviteFriend() {
    console.log('invite friend');
  }

}
