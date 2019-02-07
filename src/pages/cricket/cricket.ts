import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { Player } from '../../models/player';

@IonicPage()
@Component({
  selector: 'page-cricket',
  templateUrl: 'cricket.html',
})
export class CricketPage {

  players: Player[] = [];
  isDouble: Boolean = false;
  isTriple: Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public admob: AdMobFree) {
    // this.showBanner();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CricketPage');
    this.players.push(new Player(0, "Basti", 0));
    this.players.push(new Player(1, "Marco", 0));
    this.players.push(new Player(2, "Tim", 0));
    this.players.push(new Player(3, "Patrick", 0));
    this.showBanner();
  }

  addPoints(points: number, id: number) {
    if (this.isDouble) {
      points = points * 2;
    }
    if (this.isTriple) {
      points = points * 3;
    }
    this.players[id].setScore(points);
    this.isDouble = false;
    this.isTriple = false;
  }
  undo() {
    console.log("undo");
  }
  newgame() {
    console.log("newgame");
  }
  double() {
    this.isTriple = false;
    this.isDouble = !this.isDouble;
  }
  trible() {
    this.isDouble = false;
    this.isTriple = !this.isTriple;
  }



  showBanner() {

    let bannerConfig: AdMobFreeBannerConfig = {
      isTesting: true, // Remove in production
      autoShow: true
      //id: Your Ad Unit ID goes here
    };

    this.admob.banner.config(bannerConfig);

    this.admob.banner.prepare().then(() => {
      // success
    }).catch(e => console.log(e));

  }

  launchInterstitial() {

    let interstitialConfig: AdMobFreeInterstitialConfig = {
      isTesting: true, // Remove in production
      autoShow: true
      //id: Your Ad Unit ID goes here
    };

    this.admob.interstitial.config(interstitialConfig);

    this.admob.interstitial.prepare().then(() => {
      // success
    });

  }
}
