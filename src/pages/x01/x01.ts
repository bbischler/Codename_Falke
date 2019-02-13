import { Component, ViewChild } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio';
import { IonicPage, NavController, Platform, NavParams, Slides, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { Player } from '../../models/player';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the X01Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-x01',
  templateUrl: 'x01.html',
})
export class X01Page {
  @ViewChild(Slides) slides: Slides;
  ngAfterViewInit() {
    this.slides.spaceBetween = 1;
    this.slides.slidesPerView = 1.3;
    this.slides.centeredSlides = true;
    this.slides.effect = "cube";
  }
  num: number;
  players: Player[] = [];
  numbers: number[] = [1, 6, 11, 16];
  isDouble: Boolean = false;
  isTriple: Boolean = false;
  throwCounter: number = 0;
  playerCounter: number = 0;
  containerof3: number[] = [1, 2, 3];
  has180: Boolean = true;

  constructor(public navCtrl: NavController, public platform: Platform,
    public navParams: NavParams, public modalCtrl: ModalController,
    private nativeAudio: NativeAudio, private service: ServiceProvider) {
    this.platform.ready().then(() => {
      this.nativeAudio.preloadSimple('180', 'assets/sounds/180.mp3').then((success) => {
        console.log("success");
      }, (error) => {
        console.log(error);
      });
    });

    if (this.navParams.get('param')) {
      this.num = this.navParams.get('param');
    } else {
      this.num = 301;
    }


  }
  openModal() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    const myModal: Modal = this.modalCtrl.create("X01SettingsPage");
    myModal.present();
    this.setPlayer();
  }

  setPlayer() {
    this.players = this.service.getAllPlayer();
    for (let player of this.players) {
      player.setScore(this.num);
    }
  }

  ionViewDidLoad() {
    this.openModal();
  }
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
  }

  addPoints(points: number) {
    if (this.has180)
      this.play180();

    if (this.isDouble) {
      points = points * 2;
    }
    if (this.isTriple) {
      points = points * 3;
    }
    this.slides.slideTo(this.playerCounter, 1000);
    this.players[this.playerCounter].reducePoints(points);
    this.players[this.playerCounter].setLastScore(points);
    this.players[this.playerCounter].setThrowCount();
    this.players[this.playerCounter].setTotalScore(points);

    this.isDouble = false;
    this.isTriple = false;
    this.throwCounter++;

    if (this.throwCounter == 3) {
      this.playerCounter++;
      this.throwCounter = 0;
      if (this.playerCounter == this.players.length) {
        this.playerCounter = 0;
      }
      this.players[this.playerCounter].removeLastThreePoints();
      this.slides.slideTo(this.playerCounter, 1000);
    }
  }


  undo() { }

  double() {
    this.isTriple = false;
    this.isDouble = !this.isDouble;
  }
  triple() {
    this.isDouble = false;
    this.isTriple = !this.isTriple;
  }
  isActive(numberid) {
    if (numberid == this.playerCounter) {
      return true;
    } else {
      return false;
    }
  }


  play180() {
    this.nativeAudio.play('180').then((success) => {
      console.log("success playing");
    }, (error) => {
      console.log(error);
    });
  }

}
