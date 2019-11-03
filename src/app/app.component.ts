import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { HomePage } from '../pages/home/home';
import { ServiceProvider } from '../providers/service/service';
import { App } from 'ionic-angular';
import { timer } from 'rxjs/observable/timer';
import { Insomnia } from '@ionic-native/insomnia/ngx';


@Component({
  selector: 'page-menu',
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';
  showedAlert: boolean;
  confirmAlert: any;
  // activePage: any;
  pages: Array<{ title: string, component: any }>;
  pagesx01: Array<{ title: string, component: any }>;
  instructions: Array<{ title: string, component: any }>;
  showSplash = true;



  constructor(public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, private service: ServiceProvider,
    public alertCtrl: AlertController, public app: App, private insomnia: Insomnia) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage' },
      { title: 'Cricket', component: 'CricketPage' },
    ];

    this.pagesx01 = [
      { title: '301', component: 'X01Page' },
      { title: '501', component: 'X01Page' },
      { title: '701', component: 'X01Page' },
    ];
    this.instructions = [
      { title: 'Challenge', component: 'ChallengePage' },
      { title: 'Instructions', component: 'InstructionsPage' },
      { title: 'Settings', component: 'AppsettingsPage' },
    ];

  }

  hidesplash() {
    this.showSplash = false;
  }


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.insomnia.keepAwake()
        .then(
          () => console.log('success keep awake'),
          () => console.log('error keep awake')
        );
      this.statusBar.overlaysWebView(true);
      this.splashScreen.hide();
      timer(1200).subscribe(() => this.hidesplash())
    });
    this.platform.registerBackButtonAction(() => {
      // Catches the active view

      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();
      // Checks if can go back before show up the alert
      let view = nav.getActive().instance.pageName;
      if (view === 'MODAL') {
        nav.pop();
        this.nav.setRoot('HomePage');
      }

      if (activeView.name === 'HomePage') {
        if (nav.canGoBack()) {
          nav.pop();
        } else {

          this.service.showMessageOkCancel('Exit?', 'Are you sure you want to exit the app?', ['Cancel', 'Yes']).then((res) => {
            if (res) {
              this.platform.exitApp();
            } else {
              this.nav.setRoot('HomePage');
            }
          }); 
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
  }

  openPageX01(page, num) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // this.notAvaiableToast();

    this.nav.push(page.component, {
      param: num
    });

  }

  checkActive(page) {
    return page == this.service.getActivePage();
  }

  notAvaiableToast() {
    this.service.toastPopup('playerToast', 'coming soon...');
  }
}
