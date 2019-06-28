import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ChallengePage } from '../pages/challenge/challenge';
import { HomePage } from '../pages/home/home';
import { InstructionsPage } from '../pages/instructions/instructions';
import { AppsettingsPage } from '../pages/appsettings/appsettings';
import { CricketPage } from '../pages/cricket/cricket';
import { X01Page } from '../pages/x01/x01';
import { ServiceProvider } from '../providers/service/service';
import { App } from 'ionic-angular';

@Component({
  selector: 'page-menu',
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  showedAlert: boolean;
  confirmAlert: any;
  // activePage: any;
  pages: Array<{ title: string, component: any }>;
  pagesx01: Array<{ title: string, component: any }>;
  instructions: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, private service: ServiceProvider,
    public alertCtrl: AlertController, public app: App) {
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
      { title: 'Instructions', component: InstructionsPage },
      { title: 'Settings', component: AppsettingsPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.platform.registerBackButtonAction(() => {
      // Catches the active view

      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();
      // Checks if can go back before show up the alert
      let view = nav.getActive().instance.pageName;
      if (view === 'MODAL') {
        nav.pop();
        this.nav.setRoot(HomePage);
      }

      if (activeView.name === 'HomePage') {
        if (nav.canGoBack()) {
          nav.pop();
        } else {
          const alert = this.alertCtrl.create({
            title: 'Confirm Exit',
            message: 'Are you sure you want to exit the app?',
            buttons: [{
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                this.nav.setRoot(HomePage);
              }
            }, {
              text: 'Exit',
              handler: () => {
                this.platform.exitApp();
              }
            }]
          });
          alert.present();
        }
      }
      else {
        this.nav.setRoot(HomePage);
      }
    });
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
    this.nav.push(page.component, {
      param: num
    });

    this.service.setActivePage(num);
  }

  checkActive(page) {
    return page == this.service.getActivePage();
  }
}
