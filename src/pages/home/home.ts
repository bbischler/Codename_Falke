import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { CricketPage } from '../cricket/cricket';
import { X01Page } from '../x01/x01';
import { InstructionsPage } from '../instructions/instructions';
import { ServiceProvider } from '../../providers/service/service';
import { ChallengePage } from '../challenge/challenge';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html' 
})
export class HomePage {
  private admobId: any;

  constructor(public platform: Platform, public navCtrl: NavController, private service: ServiceProvider, public admob: AdMobFree) {

    // this.platform = platform;
    // if (/(android)/i.test(navigator.userAgent)) {
    //   this.admobId = {
    //     banner: 'ca-app-pub-3290488239272299/2853593930',
    //   };
    // } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    //   this.admobId = {
    //     banner: 'ca-app-pub-3290488239272299/1907343774',
    //   };
    // }
    this.createBanner();
  }
  createBanner() {

    let bannerConfig: AdMobFreeBannerConfig = {
      isTesting: true, // Remove in production 
      autoShow: true,
      // id: 'ca-app-pub-3290488239272299/2853593930'
    };

    this.admob.banner.config(bannerConfig);

    this.admob.banner.prepare().then(() => {
      // success
    }).catch(e => console.log(e));

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
  openChallenge() {
    this.service.setActivePage('Challenge');
    this.navCtrl.push(ChallengePage);
  }
  inviteFriend() {
    console.log('invite friend');
  }

}
