import { CricketPoint } from './../../models/cricketPoint';
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

  players: Array<CricketPlayer> = new Array<CricketPlayer>();
  isDouble: Boolean = false;
  isTriple: Boolean = false;
  containerofThree: number[] = [3, 2, 1];
  throwAmount: number = 1; // Factor for double and triple multiplication

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

  addPoints(point: CricketPoint, id: number) {
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

    this.players[id - 1].throwCricket(point, this.throwAmount);
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
    console.log(typeof(this.players));
    this.players = this.service.getAllPlayer() as CricketPlayer[];
    function flatten(a,b){return a.concat(b);}
    for(let player of this.players){
      for(let point of player.points){

        // onClosed - Handler
        point.registerOnClosed((value, isClosed) =>{
          var allClosed : Boolean = true;
          var pointsToCheck = (this.players.map(p => p.points)
                                           .reduce(flatten, []) as CricketPoint[])
                                           .filter(p => p.value == value);
          var sumOfClosed = pointsToCheck.map(p => (p.isClosed ? 0 : 1) as number)
                                         .reduce((sum, current) => sum + current);
          for(let point of pointsToCheck){
            point.setIsClosed = (sumOfClosed == 0);
          }
        });
      }
    }
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

