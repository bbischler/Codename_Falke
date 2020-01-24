import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, Slides } from 'ionic-angular';
import { X01stats } from "../../models/x01stats";
import { Cricketstats } from "../../models/cricketstats";
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
  tabs: any = [];
  SwipedTabsIndicator: any = null;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private service: ServiceProvider) {
    this.tabs = ["X-01", "Cricket"];
    this.x01stats = JSON.parse(localStorage.getItem('x01stats'));
    this.cricketstats = JSON.parse(localStorage.getItem('cricketstats'));
    console.log(this.x01stats);
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
  playCricket() {
    this.service.setActivePage('Cricket');
    this.navCtrl.push('CricketPage');
  }

  playX01(num: number) {
    this.service.setActivePage(num);
    this.navCtrl.push('X01Page', {
      param: num
    });
  }
  deletex01stats() {
    this.x01stats = [];
    localStorage.removeItem("x01stats")
  }

  deletecricketstats() {
    this.cricketstats = [];
    localStorage.removeItem("cricketstats")
  }

  popupDeleteCricketStats() {
    this.service.showMessageOkCancel('Delete Cricket Stats?', 'Do you really want to delete dricket stats?', ['No', 'Yes']).then((res) => {
      if (res) {
        this.deletecricketstats();
      } else {
      }
    });
  }
  popupDeleteX01Stats() {
    this.service.showMessageOkCancel('Delete X-01 Stats?', 'Do you really want to delete x-01 stats?', ['No', 'Yes']).then((res) => {
      if (res) {
        this.deletex01stats();
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
}
