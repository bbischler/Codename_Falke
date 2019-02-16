import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ChallengePage } from '../pages/challenge/challenge';
import { HomePage } from '../pages/home/home';
import { InstructionsPage } from '../pages/instructions/instructions';
import { CricketPage } from '../pages/cricket/cricket';
import { X01Page } from '../pages/x01/x01';
import { ServiceProvider } from '../providers/service/service';


@Component({
  selector: 'page-menu',
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = X01Page;
  showedAlert: boolean;
  confirmAlert: any;
  // activePage: any;
  pages: Array<{ title: string, component: any }>;
  pagesx01: Array<{ title: string, component: any }>;
  instructions: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, private service: ServiceProvider,
    public alertCtrl: AlertController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Cricket', component: CricketPage },
    ];

    this.pagesx01 = [
      { title: '301', component: X01Page },
      { title: '501', component: X01Page },
      { title: '701', component: X01Page },
    ];
    this.instructions = [
      { title: 'Challenge', component: ChallengePage },
      { title: 'Instructions', component: InstructionsPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.showedAlert = false;
      // Confirm exit
      this.platform.registerBackButtonAction(() => {
        console.log("back");

        if (!this.service.getGameIsActive()) {
          console.log("no game active");
          if (this.nav.length() == 1) {
            console.log("lastpage");

            if (!this.showedAlert) {
              this.confirmExitApp();
            } else {
              this.showedAlert = false;
              this.confirmAlert.dismiss();
            }
          } else {
            this.nav.pop();
          }
        } else {
          console.log("game active");

          this.confirmExitGame();
        }
      });

    });
  }

  confirmExitApp() {
    this.showedAlert = true;
    this.confirmAlert = this.alertCtrl.create({
      title: "Confirm Exit",
      message: "Are you sure you want to exit the app?",
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.showedAlert = false;
            return;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.confirmAlert.present();
  }

  confirmExitGame() {
    this.showedAlert = true;
    this.confirmAlert = this.alertCtrl.create({
      title: "Leaving game",
      message: "Are you sure you want to exit the game?",
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            return;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.nav.pop();
          }
        }
      ]
    });
    this.confirmAlert.present();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // this.nav.setRoot(page.component);
    this.nav.push(page.component);
    this.service.setActivePage(page.title);

  }

  openPageX01(page, num) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // this.nav.setRoot(page.component);
    this.service.setActivePage(num);
    this.nav.push(page.component, {
      param: num
    });

  }

  checkActive(page) {
    return page == this.service.getActivePage();
  }

}
