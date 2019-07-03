import { Stack } from 'stack-typescript';
import { x01ThrowAction } from './../../models/x01ThrowAction';
import { X01Player } from './../../models/x01Player';
import { Component, ViewChild } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { IonicPage, NavController, Platform, NavParams, Slides, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { X01Settings } from '../../models/x01Settings';
import { ServiceProvider } from '../../providers/service/service';


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
  appSettings: any;
  showContent: boolean = false;

  constructor(public navCtrl: NavController, public platform: Platform,
    public navParams: NavParams, public modalCtrl: ModalController,
    private nativeAudio: NativeAudio, private service: ServiceProvider,
    private vibration: Vibration) {
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
    // this.openSettings();
    this.x01Settings = this.service.getX01Settings();
  }

  ionViewDidEnter() {
    if (localStorage.getItem('x01Storage' + this.num)) {
      this.openPopupRestore();
    } else {
      this.openSettingsModal();
    }
    this.appSettings = this.service.getAppSettings();
    this.service.setActivePage(this.num);
  }

  async ionViewCanLeave() {
    if (this.service.getGameIsActive()) {
      const shouldLeave = await this.confirmLeave();
      if (shouldLeave)
        this.storeGame();
      return shouldLeave;
    }
  }

  ionViewWillLeave() {
    this.service.setGameIsActive(false);
    this.service.deletePlayers();
  }

  openSettingsModal() {
    // this.deleteAll();
    this.deleteStorage();
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: true,
      showBackdrop: false,
    };
    const myModal: Modal = this.modalCtrl.create("X01SettingsPage", { gameNum: this.num }, myModalOptions);
    myModal.present();
    myModal.onDidDismiss(data => {
      if (data == false) {
        this.service.setGameIsActive(false);
        this.navCtrl.setRoot('HomePage');
      }
      else if (data == true) {
        this.showContent = true;
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
    console.log(this.service.checkoutTable);
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
      if (points == 25) {
        this.showPopUpTriple25();
        return;
      } else {
        points = points * 3;
      }
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
    this.activePlayer.setToThrow(this.service.getCheckOut(this.activePlayer.totalScore));

    if (this.hasWon()) {
      this.service.setGameIsActive(false);
      this.winningPopup(this.activePlayer);
      return;
    }

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
    if (this.activePlayer.totalScore <= 0) {
      return true;
    } else {
      return false;
    }
  }

  undo() {
    console.log("Undo prompted")
    var action = this.actionStack.pop();
    if (action != null) {
      // Switch to previous Player if necessary
      if (this.activePlayer.roundThrowCount == 0) {
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

  resetGame() {
    for (let p of this.players) {
      p.resetAll();
    }
  }

  play180() {
    if (this.appSettings.sound) {
      this.nativeAudio.play('180').then((success) => {
        console.log("success playing");
      }, (error) => {
        console.log(error);
      });
    }
  }

  vibrate() {
    if (this.appSettings.vibrate)
      this.vibration.vibrate(13);
  }

  vibrateMiss() {
    if (this.appSettings.vibrate)
      this.vibration.vibrate(70);
  }

  storeGame() {
    localStorage.setItem('x01Storage' + this.num, JSON.stringify({
      "players": this.players,
      "isDouble": this.isDouble,
      "isTriple": this.isTriple,
      "throwCounter": this.throwCounter,
      "playerCounter": this.playerCounter,
      "activePlayer": this.activePlayer,
      "x01Settings": this.x01Settings,
      "appSettings": this.appSettings,
      "showContent": this.showContent
    }));
    localStorage.setItem('x01Stack' + this.num, JSON.stringify(this.actionStack.toArray()));
    console.log('X01 Storage wurde gesetzt!');
    this.service.setGameIsActive(false);
    this.service.deletePlayers();

    console.log("Storage: " + localStorage.getItem('x01Storage' + this.num));
  }

  restoreGame() {
    console.log("restore X01storage");
    let x01Storage = JSON.parse(localStorage.getItem('x01Storage' + this.num));
    this.players = [];
    for (let p of x01Storage.players) {
      this.players.push(this.service.getObjectOfPlayer(p));
    }
    // this.setPlayer();
    this.isDouble = x01Storage.isDouble;
    this.isTriple = x01Storage.isTriple;
    this.throwCounter = x01Storage.throwCounter;
    this.playerCounter = x01Storage.playerCounter;
    this.x01Settings = x01Storage.x01Settings;
    this.appSettings = x01Storage.appSettings;
    this.showContent = x01Storage.showContent;
    this.playerCounter = x01Storage.playerCounter;
    this.activePlayer = this.service.getObjectOfPlayer(x01Storage.activePlayer);
    let _x01stack = JSON.parse(localStorage.getItem('x01Stack' + this.num));
    for (let stack of _x01stack) {
      let tmpAction = new x01ThrowAction();
      Object.assign(tmpAction, {
        "point": stack.point,
        "isDone": stack.isDone,
      });
      tmpAction.setPlayer(stack.player);
      this.actionStack.push(tmpAction);
    }

    this.deleteStorage();
    this.service.setGameIsActive(true);
    this.gameRestoreToast();
  }

  deleteStorage() {
    console.log("delete x01storage");
    localStorage.removeItem('x01Storage' + this.num);
    localStorage.removeItem('x01Stack' + this.num);
  }

  // POPUPS //

  async presentToastDoubleIn() {
    this.service.toastPopup('playerToast', 'First throw must be a double');
  }

  async presentToastDoubleOut() {
    this.service.toastPopup('playerToast', 'Last throw must be a double');
  }
  async showPopUpTriple25() {
    this.service.toastPopup('playerToast', 'Triple not allowed on Bull');
  }
  async gameRestoreToast() {
    this.service.toastPopup('playerToast', 'Game restored!');
  }

  openPopupRestore() {
    this.service.showMessageOkCancel('Restore?', 'Do you want to restore the last game?', ['Cancel', 'Yes']).then((res) => {
      if (res) {
        this.restoreGame();
        this.showContent = true;
      } else {
        this.openSettingsModal();
      }
    });
  }

  winningPopup(player: X01Player) {
    this.service.showMessageOkCancel('Congratulations', player.name + ' has won the game!', ['Home', 'New Game']).then((res) => {
      this.resetGame();
      if (res) {
        this.ionViewDidEnter();
      } else {
        this.navCtrl.setRoot('HomePage');
      }
    });
  }
  confirmLeave(): Promise<Boolean> {
    let resolveLeaving;
    const canLeave = new Promise<Boolean>(resolve => resolveLeaving = resolve);
    let message = 'Do you want to leave the page? <br> The game will be stored.';
    this.service.showMessageOkCancel('Leaving game', message, ['Cancel', 'Yes']).then((res) => {
      resolveLeaving(res)
    });
    return canLeave;
  }
}
