import { X01Player } from './../../models/x01Player';
import { Component, ViewChild } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { IonicPage, AlertController, NavController, Platform, NavParams, Slides, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { Player } from '../../models/player';
import { ServiceProvider } from '../../providers/service/service';
import { HomePage } from '../home/home';

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
  players: X01Player[] = [];
  numbers: number[] = [1, 6, 11, 16];
  isDouble: Boolean = false;
  isTriple: Boolean = false;
  throwCounter: number = 0;
  playerCounter: number = 0;
  containerof3: number[] = [1, 2, 3];
  has180: Boolean = true;
  gameOver: Boolean = false;
  confirmAlert: any;
  activePlayer: X01Player;

  constructor(public navCtrl: NavController, public platform: Platform,
    public navParams: NavParams, public modalCtrl: ModalController,
    private nativeAudio: NativeAudio, private service: ServiceProvider,
    public alertCtrl: AlertController) {
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
    this.openModal();
  }

  ngOnDestroy() {
    this.service.setGameIsActive(false);
  }
  openModal() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: true
    };
    const myModal: Modal = this.modalCtrl.create("X01SettingsPage", myModalOptions);
    myModal.present();
    myModal.onDidDismiss(data => {
      if (data == true)
        this.navCtrl.push(HomePage, {}, { animate: true, direction: 'back' });
      else {
        this.setPlayer();
        this.service.setGameIsActive(true);
      }
    });
  }

  setPlayer() {
    this.players = this.service.getAllPlayer() as X01Player[];
    this.players.forEach(p =>{
      p.setTotalScore(this.num);
    })
    this.activePlayer = this.players[0];
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
    if (this.hasWon()) {
      this.service.setGameIsActive(false);
    }

    this.slides.slideTo(this.playerCounter, 1000);
    this.activePlayer.throw(points);
    /*
    this.players[this.playerCounter].reducePoints(points);
    this.players[this.playerCounter].setLastScore(points);
    this.players[this.playerCounter].setThrowCount();
    this.players[this.playerCounter].setTotalScore(points);
    */
    this.isDouble = false;
    this.isTriple = false;
    this.throwCounter++;

    if (this.activePlayer.roundThrowCount == 3) {
      this.playerCounter = (this.playerCounter + 1) % this.players.length;
      this.activePlayer = this.players[this.playerCounter];
      this.activePlayer.resetForTurn();
      this.slides.slideTo(this.playerCounter, 1000);
    }
  }

  hasWon() {
    return false;
  }

  undo() {
    //marco do magic here
  }

  double() {
    this.isTriple = false;
    this.isDouble = !this.isDouble;
  }

  triple() {
    this.isDouble = false;
    this.isTriple = !this.isTriple;
  }

  isActive(numberid) {
    console.log("Check active Player " + numberid + " Active player is " + this.playerCounter)
    if (numberid == this.activePlayer.id) {
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
