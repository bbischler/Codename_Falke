import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
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

  pageName = 'HomePage';

  message: string = "Hey, here is a new cool dart scoring app";
  url: string = "https://play.google.com/store/apps/details?id=com.bischlerdeveloper.dartist";

  constructor(public navCtrl: NavController,
    private service: ServiceProvider,
    private socialSharing: SocialSharing) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.service.setActivePage("Home");
    // this.service.rateMe();
  }


  openCricket() {
    this.service.setActivePage('Cricket');
    this.navCtrl.push('CricketPage');
  }
  openX01() {
    this.service.setActivePage("X-01");
    this.navCtrl.push('X01Page');
  }
  openChallenge() {
    this.service.setActivePage('Challenge');
    this.navCtrl.push('ChallengePage');
  }
  openStats() {
    this.service.setActivePage("Stats");
    this.navCtrl.push('StatsPage');
  }

  openATW() {
    this.service.setActivePage("Around The World");
    this.navCtrl.push('AroundWorldPage');
  }

  openBob() {
    this.service.setActivePage("Bob´s 27");
    this.navCtrl.push('BobPage');
  }
  
  inviteFriend() {
    this.socialSharing.share(this.message, "Dartist", null, this.url)
      .then(() => {
      }).catch(() => {
      });
  }

  notAvaiableToast() {
    this.service.toastPopup('playerToast', 'coming soon...');
  }

}
