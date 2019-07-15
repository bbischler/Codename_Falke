import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { IonicPage, NavController } from 'ionic-angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
import { ServiceProvider } from '../../providers/service/service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private admobId: any = {
    banner: 'ca-app-pub-3290488239272299/2853593930',
  };
  message: string = "Hey, here is a new cool dart scoring app";
  url: string = "https://play.google.com/store/apps/details?id=dartknight.app";

  constructor(public platform: Platform, public navCtrl: NavController,
    private service: ServiceProvider, public admob: AdMobFree,
    private socialSharing: SocialSharing) {
    this.platform = platform;
    if (/(android)/i.test(navigator.userAgent)) {
      this.admobId = {
        banner: 'ca-app-pub-3290488239272299/2853593930',
      };
    } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
      this.admobId = {
        banner: 'ca-app-pub-3290488239272299/1907343774',
      };
    }
    this.createBanner();
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.service.setActivePage("Home");
  }


  createBanner() {

    let bannerConfig: AdMobFreeBannerConfig = {
      id: this.admobId.banner,
      isTesting: false, // Remove in production 
      autoShow: false,
      overlap: false
    };

    this.admob.banner.config(bannerConfig);

    this.admob.banner.prepare().then(() => {
      this.admob.banner.show();
      // success
    }).catch(e => console.log(e));

  }

  openCricket() {
    this.service.setActivePage('Cricket');
    this.navCtrl.push('CricketPage');
  }
  openX01(num: number) {
    this.service.setActivePage(num);
    this.navCtrl.push('X01Page', {
      param: num
    });
  }
  openChallenge() {
    this.service.setActivePage('Challenge');
    this.navCtrl.push('ChallengePage');
  }
  inviteFriend() {
    this.socialSharing.share(this.message, "Dart App", null, this.url)
      .then(() => {
      }).catch(() => {
      });
  }

}
