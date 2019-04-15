import { Stack } from 'stack-typescript';
import { x01ThrowAction } from './../../models/x01ThrowAction';
import { X01Player } from './../../models/x01Player';
import { Component, ViewChild } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { IonicPage, AlertController, ToastController, NavController, Platform, NavParams, Slides, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { Player } from '../../models/player';
import { X01Settings } from '../../models/x01Settings';
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
  x01Settings: X01Settings;
  actionStack: Stack<x01ThrowAction> = new Stack<x01ThrowAction>();

  constructor(public navCtrl: NavController, public platform: Platform,
    public navParams: NavParams, public modalCtrl: ModalController,
    private nativeAudio: NativeAudio, private service: ServiceProvider,
    public alertCtrl: AlertController, private vibration: Vibration,
    public toastController: ToastController) {
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
    this.x01Settings = this.service.getX01Settings();
  }

  ionViewDidEnter() {
    this.openSettings();
  }

  async ionViewCanLeave() {
    if (this.service.getGameIsActive()) {
      const shouldLeave = await this.confirmLeave();
      return shouldLeave;
    }
  }

  ionViewWillLeave() {
    this.service.setGameIsActive(false);
    this.service.deletePlayers();
  }

  openSettings() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: true
    };
    const myModal: Modal = this.modalCtrl.create("X01SettingsPage", myModalOptions);
    myModal.present();
    myModal.onDidDismiss(data => {
      if (data == false) {
        this.service.setGameIsActive(false);
        this.navCtrl.setRoot(HomePage);
      }
      else if (data == true) {
        this.setPlayer();
        this.x01Settings = this.service.getX01Settings();
        this.service.setGameIsActive(true);
      }
    });
  }

  setPlayer() {
    this.players = this.service.getAllPlayer() as X01Player[];
    this.players.forEach(p => {
      p.setTotalScore(this.num);
    })
    this.activePlayer = this.players[0];
  }

  addPoints(points: number) {
    if (this.x01Settings.doubleIn) {
      if (!this.isDouble && this.activePlayer.doubleIn) {
        this.presentToastDoubleIn();
        this.throw(0);
        return;
      } else {
        this.activePlayer.doubleIn = false;
      }
    }

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

    if (points == 0) {
      this.vibrateMiss()
    } else {
      this.vibrate()
    }
    this.throw(points);
  }

  throw(points: number) {
    this.slides.slideTo(this.playerCounter, 1000);
    
    var action = new x01ThrowAction(points, this.activePlayer);
    this.actionStack.push(action);
    action.do();
    
    this.isDouble = false;
    this.isTriple = false;
    this.throwCounter++;

    console.log("Player " + this.activePlayer.id + " roundThrowCounter = " + this.activePlayer.roundThrowCount);
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
    console.log("Undo prompted")

    var action = this.actionStack.pop();
    if (action != null){
      // Switch to previous Player if necessary
      if(this.activePlayer.roundThrowCount == 0){
        this.playerCounter = (this.playerCounter - 1) < 0 ? this.players.length - 1 : (this.playerCounter - 1)
        this.activePlayer = this.players[this.playerCounter];
        this.slides.slideTo(this.playerCounter, 1000);
      }  
      action.undo();
    }
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

  vibrate() {
    this.vibration.vibrate(13);
  }

  vibrateMiss() {
    this.vibration.vibrate(70);
  }

  confirmLeave(): Promise<Boolean> {
    let resolveLeaving;
    const canLeave = new Promise<Boolean>(resolve => resolveLeaving = resolve);
    const alert = this.alertCtrl.create({
      title: 'Leaving game',
      message: 'Do you want to leave the page? <br><br> The game will be stored.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => resolveLeaving(false)
        },
        {
          text: 'Yes',
          handler: () => resolveLeaving(true)
        }
      ]
    });
    alert.present();
    return canLeave

  }

  async presentToastDoubleIn() {
    const toast = await this.toastController.create({
      cssClass: "playerToast",
      message: 'First throw must be a double',
      duration: 2500,
      position: 'top'
    });
    toast.present();
  }

  async presentToastDoubleOut() {
    const toast = await this.toastController.create({
      cssClass: "playerToast",
      message: 'Last throw must be a double',
      duration: 2500,
      position: 'top'
    });
    toast.present();
  }
}
