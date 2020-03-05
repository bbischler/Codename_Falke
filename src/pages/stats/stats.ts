import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, Slides } from 'ionic-angular';
import { X01stats } from "../../models/x01/x01stats";
import { Cricketstats } from "../../models/cricket/cricketstats";
import { Atwstats } from "../../models/atw/atwstats";
import { Bobstats } from "../../models/bob/bobstats";

import { ModalController, ModalOptions, Modal } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides;
  private x01stats: X01stats[] = [];
  private cricketstats: Cricketstats[] = [];
  private atwstats: Atwstats[] = [];
  private bobstats: Bobstats[] = [];
  tabs: any = [];
  SwipedTabsIndicator: any = null;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private service: ServiceProvider) {
    this.tabs = ["X-01", "Cricket", "ATW", "Bob´s 27"];
    this.x01stats = JSON.parse(localStorage.getItem('x01stats'));
    this.cricketstats = JSON.parse(localStorage.getItem('cricketstats'));
    this.atwstats = JSON.parse(localStorage.getItem('atwstats'));
    this.bobstats = JSON.parse(localStorage.getItem('bobstats'));
    console.log(this.bobstats);
  }


  ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");
    this.service.setActivePage("Stats");
  }

  selectTab(index) {
    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (100 * index) + '%,0,0)';
    this.SwipedTabsSlider.slideTo(index, 500);
  }

  updateIndicatorPosition() {
    // this condition is to avoid passing to incorrect index
    if (this.SwipedTabsSlider.length() > this.SwipedTabsSlider.getActiveIndex()) {
      this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (this.SwipedTabsSlider.getActiveIndex() * 100) + '%,0,0)';
    }

  }

  animateIndicator($event) {
    if (this.SwipedTabsIndicator)
      this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (($event.progress * (this.SwipedTabsSlider.length() - 1)) * 100) + '%,0,0)';
  }

  openX01StatsForGame(game: X01stats) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: true,
      showBackdrop: true,
      cssClass: 'stats-modal'
    };
    const myModal: Modal = this.modalCtrl.create("StatsmodalPage", { game: game }, myModalOptions);
    myModal.present();

  }

  openCricketStatsForGame(game: Cricketstats) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: true,
      showBackdrop: true,
      cssClass: 'stats-modal'
    };
    const myModal: Modal = this.modalCtrl.create("StatscricketmodalPage", { game: game }, myModalOptions);
    myModal.present();
  }
  openATWStatsForGame(game: Atwstats) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: true,
      showBackdrop: true,
      cssClass: 'stats-modal'
    };
    const myModal: Modal = this.modalCtrl.create("StatsATWmodalPage", { game: game }, myModalOptions);
    myModal.present();
  }

  openBobStatsForGame(game: Bobstats) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: true,
      showBackdrop: true,
      cssClass: 'stats-modal'
    };
    const myModal: Modal = this.modalCtrl.create("StatsBobmodalPage", { game: game }, myModalOptions);
    myModal.present();
  }

  playX01() {
    this.service.setActivePage("X-01");
    this.navCtrl.push('X01Page');
  }
  playCricket() {
    this.service.setActivePage('Cricket');
    this.navCtrl.push('CricketPage');
  }
  playATW() {
    this.service.setActivePage("Around The World");
    this.navCtrl.push('AroundWorldPage');
  }

  playBob() {
    this.service.setActivePage("Bob´s 27");
    this.navCtrl.push('BobPage');
  }

  deletex01stats() {
    this.x01stats = [];
    localStorage.removeItem("x01stats")
  }

  deletecricketstats() {
    this.cricketstats = [];
    localStorage.removeItem("cricketstats")
  }
  deleteatwstats() {
    this.atwstats = [];
    localStorage.removeItem("atwstats")
  }
  deletebobstats() {
    this.bobstats = [];
    localStorage.removeItem("bobstats")
  }
  popupDeleteX01Stats() {
    this.service.showMessageOkCancel('Delete X-01 Stats?', 'Do you really want to delete X-01 stats?', ['No', 'Yes']).then((res) => {
      if (res) {
        this.deletex01stats();
      } else {
      }
    });
  }
  popupDeleteCricketStats() {
    this.service.showMessageOkCancel('Delete Cricket Stats?', 'Do you really want to delete Cricket stats?', ['No', 'Yes']).then((res) => {
      if (res) {
        this.deletecricketstats();
      } else {
      }
    });
  }
  popupDeleteATWStats() {
    this.service.showMessageOkCancel('Delete ATW Stats?', 'Do you really want to delete Around The World stats?', ['No', 'Yes']).then((res) => {
      if (res) {
        this.deleteatwstats();
      } else {
      }
    });
  }

  popupDeleteBobStats() {
    this.service.showMessageOkCancel('Delete Bob´s 27 Stats?', 'Do you really want to delete Bob´s 27 stats?', ['No', 'Yes']).then((res) => {
      if (res) {
        this.deletebobstats();
      } else {
      }
    });
  }

  hasX01Stats() {
    if (this.x01stats)
      return this.x01stats.length > 0;
    else return false;
  }
  hasCricketStats() {
    if (this.cricketstats)
      return this.cricketstats.length > 0;
    else return false;
  }
  hasATWStats() {
    if (this.atwstats)
      return this.atwstats.length > 0;
    else return false;
  }
  hasBobStats() {
    if (this.bobstats)
      return this.bobstats.length > 0;
    else return false;
  }
}
