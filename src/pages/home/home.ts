import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CricketPage } from '../cricket/cricket';
import { X01Page } from '../x01/x01';
import { ServiceProvider } from '../../providers/service/service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private service: ServiceProvider) {

  }

  openCricket() {
    this.service.setActivePage('Cricket');
    this.navCtrl.push(CricketPage);
  }
  openX01(num: number) {
    this.service.setActivePage(num);
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
