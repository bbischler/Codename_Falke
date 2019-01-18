import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the X01Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-x01',
  templateUrl: 'x01.html',
})
export class X01Page {
  num: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.num = this.navParams.get('param');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ' + this.num);
  }

}
