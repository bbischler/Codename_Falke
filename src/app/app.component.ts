import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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

  rootPage: any = InstructionsPage;

  // activePage: any;
  pages: Array<{ title: string, component: any }>;
  pagesx01: Array<{ title: string, component: any }>;
  instructions: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private service: ServiceProvider, ) {
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
      { title: 'Instructions', component: InstructionsPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
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
    this.service.setActivePage(num);
    this.nav.push(page.component, {
      param: num
    });

  }

  checkActive(page) {
    return page == this.service.getActivePage();
  }

}
