import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CricketPage } from '../cricket/cricket';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  openCricket() {
    console.log('open cricket');
    this.navCtrl.setRoot(CricketPage);
  }
  openX01(num: number) {
    console.log('open ' + num + "01");
    // this.navCtrl.setRoot(CricketPage);
  }
  openInstructions() {
    console.log('open instructions');
    // this.navCtrl.setRoot(CricketPage);
  }
  inviteFriend() {
    console.log('invite friend');
    // this.navCtrl.setRoot(CricketPage);
  }

}
