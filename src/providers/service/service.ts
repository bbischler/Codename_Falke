import { Player } from '../../models/player';
import { X01Player } from '../../models/x01Player';
import { X01Settings } from '../../models/x01Settings';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController, Platform } from 'ionic-angular';
import { AdMobFreeBannerConfig, AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
import { AppRate, AppRatePreferences } from '@ionic-native/app-rate/ngx';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
// interface AppRatePreferencesEnhanced extends AppRatePreferences {
//   openUrl: (url: string) => void;
// }

@Injectable()
export class ServiceProvider {
  activePage: string = 'Home';
  x01Settings: X01Settings = new X01Settings(false, 3, 1, false, true);
  players: Player[] = [];
  gameIsActive: Boolean = false;
  private admobId: any = {
    banner: 'ca-app-pub-3290488239272299/2853593930',
    interstitial: 'ca-app-pub-3290488239272299/6076061171',
  };

  constructor(public appRate: AppRate, public platform: Platform, public admob: AdMobFree, private http: HttpClient, public alertController: AlertController, public toastController: ToastController) {

    this.platform = platform;
    if (/(android)/i.test(navigator.userAgent)) {
      this.admobId = {
        banner: 'ca-app-pub-3290488239272299/2853593930',
        interstitial: 'ca-app-pub-3290488239272299/6076061171',
      };
    } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
      this.admobId = {
        banner: 'ca-app-pub-3290488239272299/1907343774',
        interstitial: 'ca-app-pub-3290488239272299/2248496801',
      };
    }
    this.setAppSettings();
  }


  // rateMe() {
  //   const custompreferences: AppRatePreferencesEnhanced = {
  //     displayAppName: 'Dartist',
  //     usesUntilPrompt: 5,
  //     promptAgainForEachNewVersion: false,
  //     inAppReview: true,
  //     storeAppURL: {
  //       android: 'market://details?id=com.bischlerdeveloper.dartist',
  //     },
  //     customLocale: {
  //       title: "Would you mind rating %@?",
  //       message: "It won’t take more than a minute and helps to promote our app. Thanks for your support!",
  //       cancelButtonLabel: "No, Thanks",
  //       laterButtonLabel: "Remind Me Later",
  //       rateButtonLabel: "Rate It Now",
  //       yesButtonLabel: "Yes!",
  //       noButtonLabel: "Not really",
  //       appRatePromptTitle: 'Do you like using %@',
  //       feedbackPromptTitle: 'Mind giving us some feedback?',
  //     },
  //     callbacks: {
  //       handleNegativeFeedback: function () {
  //         window.open('mailto:bischler.developer@gmail.com', '_system');
  //       },
  //       onRateDialogShow: function (callback) {
  //         callback(1) // cause immediate click on 'Rate Now' button
  //       },
  //       onButtonClicked: function (buttonIndex) {
  //         console.log("onButtonClicked -> " + buttonIndex);
  //       }
  //     },
  //     openUrl: (this.appRate.preferences as AppRatePreferencesEnhanced).openUrl
  //   };
  //   this.appRate.preferences = custompreferences;
  //   this.appRate.promptForRating(false);
  // }

  getActivePage() {
    return this.activePage;
  }
  setActivePage(page) {
    this.activePage = page;
  }
  setX01Settings(settings: X01Settings) {
    this.x01Settings = settings;
    localStorage.setItem("doubleOutGame", JSON.stringify(this.x01Settings.doubleOut));
  }

  resetX01Settings() {
    this.x01Settings = new X01Settings(false, 3, 1, false, true);
    localStorage.removeItem("doubleOutGame");
  }
  getX01Settings() {
    return this.x01Settings;
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  getAllPlayer() {
    return this.players;
  }

  setGameIsActive(isactive: Boolean) {
    console.log("game: " + isactive);
    this.gameIsActive = isactive;
  }
  getGameIsActive() {
    return this.gameIsActive;
  }
  deletePlayers() {
    console.log("delete players");
    this.players = [];
  }
  setAppSettings() {
    if (!JSON.parse(localStorage.getItem('appsettings'))) {
      console.log("appsettings in service NICHT gesetz");
      localStorage.setItem('appsettings', JSON.stringify({
        "sound": true,
        "vibrate": true
      }));
    }
  }
  getAppSettings() {
    return JSON.parse(localStorage.getItem('appsettings'));
  }

  getObjectOfPlayer(p) {
    let tmpPlayer = new X01Player()
    Object.assign(tmpPlayer, {
      "roundScore": p.roundScore,
      "avg": p.avg,
      "toThrow": p.toThrow,
      "lastThreeScores": p.lastThreeScores,
      "legs": p.legs,
      "sets": p.sets,
      "doubleIn": p.doubleIn,
      "doubleOut": p.doubleIn,
      "id": p.id,
      "name": p.name,
      "totalScore": p.totalScore,
      "roundThrowCount": p.roundThrowCount,
      "totalThrowCount": p.totalThrowCount,
      "totalPointsPerLeg": p.totalPointsPerLeg,
      "avgPerLeg": p.avgPerLeg
    });
    return tmpPlayer;
  }

  // POPUPS
  async showMessageOkCancel(title, message, buttons) {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<Boolean>(resolve => {
      resolveFunction = resolve;
    });
    const alert = await this.alertController.create({
      title: title,
      message: message,
      buttons: [{
        text: buttons[0],
        handler: () => resolveFunction(false)
      }, {
        text: buttons[1],
        handler: () => resolveFunction(true)
      }],
      enableBackdropDismiss: false
    });
    await alert.present();
    return promise;
  }

  // TOASTS
  async toastPopup(cssClass, message) {
    const toast = await this.toastController.create({
      cssClass: cssClass,
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
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



  createInterstitial() {
    let interstitialConfig: AdMobFreeInterstitialConfig = {
      id: this.admobId.interstitial,
      isTesting: false, // Remove in production
      autoShow: true
    };

    this.admob.interstitial.config(interstitialConfig);

    this.admob.interstitial.prepare().then(() => {
      // success
    });


  }
}


