import { CricketPlayer } from './../../models/cricketPlayer';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Player } from '../../models/player';
import { ServiceProvider } from '../../providers/service/service';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-cricket',
  templateUrl: 'cricket.html',
})
export class CricketPage {

  players: CricketPlayer[] = [];
  isDouble: Boolean = false;
  isTriple: Boolean = false;
  containerofThree: number[] = [3, 2, 1];
  throwAmount: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public admob: AdMobFree, public modalCtrl: ModalController,
    private service: ServiceProvider, private vibration: Vibration) {
    // this.showBanner();
    this.openModal();
  }

  ionViewDidLoad() {
    this.setPlayer();
    this.showBanner();
  }

  addPoints(points: number, id: number) {
    this.throwAmount = 1;
    this.vibrate();

    if (this.isDouble) {
      this.throwAmount = 2;
      // points = points * 2;
    }
    if (this.isTriple) {
      this.throwAmount = 3;
      // points = points * 3;
    }

    this.players[id - 1].throw(points, this.throwAmount);
    // this.players[id - 1].throw(points);
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

  vibrate() {
    this.vibration.vibrate(13);
  }

  openModal() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    const myModal: Modal = this.modalCtrl.create("CricketSettingsPage");
    myModal.present();
    myModal.onDidDismiss(data => {
      if (data == true)
        this.navCtrl.push(HomePage, {}, { animate: true, direction: 'back' });
      else {
        this.setPlayer();
        this.service.setGameIsActive(true);
      }
    });
  }
  setPlayer() {
    this.players = this.service.getAllPlayer() as CricketPlayer[];
  }

  ngOnDestroy() {
    this.service.setGameIsActive(false);
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

