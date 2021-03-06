import { Stack } from 'stack-typescript';
import { x01ThrowAction } from '../../models/x01/x01ThrowAction';
import { X01Player } from '../../models/x01/x01Player';
import { Component, ViewChild } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { IonicPage, PopoverController, NavController, Platform, NavParams, Slides, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { X01Settings } from '../../models/x01/x01Settings';
import { ServiceProvider } from '../../providers/service/service';
import { DataProvider } from '../../providers/data/data';
import { X01stats } from '../../models/x01/x01stats';
import { Quickstatsx01Component } from '../../components/quickstatsx01/quickstatsx01';


@IonicPage()
@Component({
  selector: 'page-x01',
  templateUrl: 'x01.html',
})
export class X01Page {
  @ViewChild(Slides) slides: Slides;
  ngAfterViewInit() {
    this.slides.spaceBetween = 0;
    this.slides.slidesPerView = 0;
    this.slides.centeredSlides = true;
    this.slides.effect = "cube";
  }

  pageName = '';

  // num: number;
  players: X01Player[] = [];
  numbers: number[] = [1, 6, 11, 16];
  isDouble: Boolean = false;
  isTriple: Boolean = false;
  throwCounter: number = 0;
  playerCounter: number = 0;
  containerof3: number[] = [1, 2, 3];
  gameOver: Boolean = false;
  confirmAlert: any;
  activePlayer: X01Player;
  x01Settings: X01Settings;
  actionStack: Stack<x01ThrowAction> = new Stack<x01ThrowAction>();
  appSettings: any;
  showContent: boolean = false;
  x01stats: X01stats[] = [];
  currentleg: number = 1;
  currentset: number = 1;
  legssets: String[] = [];
  bust: boolean = false;
  constructor(public popoverCtrl: PopoverController, public navCtrl: NavController, public platform: Platform,
    public navParams: NavParams, public modalCtrl: ModalController,
    private nativeAudio: NativeAudio, private service: ServiceProvider,
    private vibration: Vibration, public data: DataProvider) {
    this.platform.ready().then(() => {
      this.nativeAudio.preloadSimple('180', 'assets/sounds/180.mp3').then((success) => {
      }, (error) => {
        console.log(error);
      });
    });
    this.x01Settings = this.service.getX01Settings();
  }

  ionViewDidEnter() {
    if (localStorage.getItem('x01Storage' + this.x01Settings.num)) {
      this.openPopupRestore();
    } else {
      this.openSettingsModal();
    }
    this.getStatsStorage();
    this.appSettings = this.service.getAppSettings();
    this.service.setActivePage(this.x01Settings.num);
  }

  getStatsStorage() {
    if (localStorage.getItem('x01stats') === null) {
      this.x01stats.push(new X01stats(0));
    } else {
      this.x01stats = JSON.parse(localStorage.getItem('x01stats'));
      this.x01stats.push(new X01stats(this.x01stats.length));
    }
  }

  async ionViewCanLeave() {
    if (this.service.getGameIsActive()) {
      this.storeGame();
      this.showGameStored();
      return true;
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
    const myModal: Modal = this.modalCtrl.create("X01SettingsPage", { gameNum: this.x01Settings.num }, myModalOptions);
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
        this.setGame();
      }
    });
  }
  setGame() {
    this.isDouble = false;
    this.isTriple = false;
    this.throwCounter = 0;
    this.playerCounter = 0;
    this.activePlayer = this.players[0];
    this.currentleg = 1;
    this.currentset = 1;
  }

  setPlayer() {
    this.players = this.service.getAllPlayer() as X01Player[];
    this.players.forEach(p => {
      p.setTotalScore(this.x01Settings.num);
    })
    this.activePlayer = this.players[0];
    this.playerCounter = 0;
    this.slides.slideTo(this.playerCounter, 1000);
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

    if (this.isDouble) {
      points = points * 2;
    }
    if (this.isTriple) {
      if (points == 25) {
        this.showPopUpTriple25();
        this.isTriple = false;
        return;
      }
      points = points * 3;
    }
    this.throw(points);
  }



  throw(points: number) {
    if (points == 0) {
      this.vibrateMiss()
    } else {
      this.vibrate()
    }

    this.slides.slideTo(this.playerCounter, 1000);
    var action = new x01ThrowAction(points, this.activePlayer);
    this.actionStack.push(action);
    action.do();

    if (this.hasWon()) {
      if (this.x01Settings.legbased)
        this.winningPopupLegbased(this.activePlayer);
      else
        this.winningPopup(this.activePlayer);
      return;
    }

    this.isDouble = false;
    this.isTriple = false;
    this.throwCounter++;


    if (this.activePlayer.roundThrowCount == 3) {
      this.has180();
      this.playerCounter = (this.playerCounter + 1) % this.players.length;
      this.activePlayer = this.players[this.playerCounter];
      this.activePlayer.resetForTurn();
      this.slides.slideTo(this.playerCounter, 1000);

    }

  }

  writeStatsInStorage() {
    localStorage.setItem('x01stats', JSON.stringify(this.x01stats));
  }

  has180() {
    let scores = this.activePlayer.lastScores;
    let length = scores.length - 1;
    if (scores[length] + scores[length - 1] + scores[length - 2] == 180)
      this.play180();
  }


  doLegBasedStuff() {
    this.legssets.push(this.currentleg + "/" + this.currentset);
    this.activePlayer.increaseLegs();
    this.winningLegToast(this.activePlayer.name);
    this.resetGameLegbased();
    this.currentleg++;
    // this.setPlayer();
  }

  checkLegbasedWinning(_score: number) {
    if (this.x01Settings.doubleOut) {
      if (this.checkDoubleOutWinning(_score)) {
        this.doLegBasedStuff();
      }
    } else {
      if (this.checkNormalWinning(_score)) {
        this.doLegBasedStuff();
      }
    }

    for (let p of this.players) {
      if (p.checkLegs(this.x01Settings.legs)) {
        p.increaseSet();
        this.currentleg = 1;
        this.currentset++;
        this.setAllLegsZero();
      }
      if (p.checkSets(this.x01Settings.sets))
        return true;
    }
    return false;
  }

  setAllLegsZero() {
    this.players.forEach(function (player) {
      player.legs = 0;
    });
  }

  checkDoubleOutWinning(_score: number) {
    if (_score == 0 && this.isDouble) {
      return true;
    }
    else if (_score <= 1) {
      this.bust = true;
      this.presentBust();
      let tmpRoundCount = this.activePlayer.roundThrowCount;
      for (let i = 0; i < tmpRoundCount; i++)
        this.undo();

      for (let i = 0; i < 3; i++)
        this.throw(0);
      this.bust = false;
      return false;
    }
    else {
      return false;
    }
  }

  checkNormalWinning(_score: number) {
    if (_score == 0) {
      return true;
    }
    else if (_score < 0) {
      this.bust = true;
      this.presentBust();
      let tmpRoundCount = this.activePlayer.roundThrowCount;
      for (let i = 0; i < tmpRoundCount; i++)
        this.undo();

      for (let i = 0; i < 3; i++)
        this.throw(0);
      this.bust = false;
      return false;
    } else {
      return false;
    }

  }

  setStats() {
    this.x01stats[this.x01stats.length - 1].num = this.x01Settings.num;
    this.x01stats[this.x01stats.length - 1].isLegBased = this.x01Settings.legbased;
    this.x01stats[this.x01stats.length - 1].legssets = this.legssets;
    this.x01stats[this.x01stats.length - 1].date = new Date();
    this.x01stats[this.x01stats.length - 1].players = this.players;
    this.writeStatsInStorage();
  }

  hasWon() {
    let _score = this.activePlayer.totalScore;

    if (this.x01Settings.legbased) {
      return this.checkLegbasedWinning(_score);
    }
    else {
      if (this.x01Settings.doubleOut) {
        return this.checkDoubleOutWinning(_score)
      } else {
        return this.checkNormalWinning(_score)
      }
    }
  }

  undo() {
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
    this.players = [];
    this.service.deletePlayers();
  }


  resetGameLegbased() {
    for (let p of this.players) {
      p.prepareRematch(this.x01Settings.num);
    }
    this.activePlayer = this.players[0];
    this.playerCounter = 0;
    this.actionStack = new Stack<x01ThrowAction>();
    this.slides.slideTo(this.playerCounter, 1000);
  }

  play180() {
    if (this.appSettings.sound) {
      this.nativeAudio.play('180').then((success) => {
      }, (error) => {
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
    localStorage.setItem('x01Storage' + this.x01Settings.num, JSON.stringify({
      "players": this.players,
      "isDouble": this.isDouble,
      "isTriple": this.isTriple,
      "throwCounter": this.throwCounter,
      "playerCounter": this.playerCounter,
      "activePlayer": this.activePlayer,
      "x01Settings": this.x01Settings,
      "appSettings": this.appSettings,
      "showContent": this.showContent,
      "currentleg": this.currentleg,
      "currentset": this.currentset,
      "legssets": this.legssets,
    }));
    localStorage.setItem('x01Stack' + this.x01Settings.num, JSON.stringify(this.actionStack.toArray()));
    this.service.setGameIsActive(false);
    this.service.deletePlayers();
  }

  restoreGame() {
    this.actionStack = new Stack<x01ThrowAction>();
    let x01Storage = JSON.parse(localStorage.getItem('x01Storage' + this.x01Settings.num));
    this.isDouble = x01Storage.isDouble;
    this.isTriple = x01Storage.isTriple;
    this.throwCounter = x01Storage.throwCounter;
    this.playerCounter = x01Storage.playerCounter;
    this.x01Settings = x01Storage.x01Settings;
    this.appSettings = x01Storage.appSettings;
    this.showContent = x01Storage.showContent;
    this.playerCounter = x01Storage.playerCounter;
    this.currentleg = x01Storage.currentleg;
    this.currentset = x01Storage.currentset;
    this.legssets = x01Storage.legssets;
    this.players = [];
    for (let p of x01Storage.players) {
      let tmpPlayer = new X01Player(this.data, p.id, p.name)
      Object.assign(tmpPlayer, {
        "totalScore": p.totalScore,
        "roundThrowCount": p.roundThrowCount,
        "totalThrowCount": p.totalThrowCount,
        "roundScore": p.roundScore,
        "avg": p.avg,
        "toThrow": p.toThrow,
        "lastScores": p.lastScores,
        "legs": p.legs,
        "sets": p.sets,
        "doubleIn": p.doubleIn,
        "doubleOut": p.doubleOut,
        "totalPointsPerLeg": p.totalPointsPerLeg,
        "avgPerLeg": p.avgPerLeg,
        "totalThrowsPerLeg": p.totalThrowsPerLeg,
        "totalSCoreForAllGames": p.totalSCoreForAllGames,
        "firstNinePerLeg": p.firstNinePerLeg
      });
      this.players.push(tmpPlayer);
    }
    // this.setPlayer();
    this.activePlayer = this.players[this.playerCounter];

    let tmp: Array<x01ThrowAction> = JSON.parse(localStorage.getItem('x01Stack' + this.x01Settings.num));
    for (let tmpAct of tmp.reverse()) {
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].id == tmpAct.player.id)
          tmpAct.player = this.players[i];
      }
      var act = new x01ThrowAction(tmpAct.point, tmpAct.player)
      Object.assign(act, {
        "isDone": tmpAct.isDone
      });
      this.actionStack.push(act);
    }

    this.deleteStorage();
    this.service.setGameIsActive(true);
    this.slides.slideTo(this.playerCounter, 1000);
    this.gameRestoreToast();
  }

  deleteStorage() {
    localStorage.removeItem('x01Storage' + this.x01Settings.num);
    localStorage.removeItem('x01Stack' + this.x01Settings.num);
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
  async presentBust() {
    this.service.toastPopup('playerToastBust', 'Bust!');
  }
  async showGameStored() {
    this.service.toastPopup('playerToast', 'Game is stored');
  }

  openPopupRestore() {
    this.service.showMessageOkCancel('Restore ' + this.x01Settings.num + '?', 'Do you want to restore the last game?', ['New game', 'Yes']).then((res) => {
      if (res) {
        this.restoreGame();
        this.showContent = true;
        this.slides.slideTo(0, 1000);
      } else {
        this.openSettingsModal();
      }
    });
  }
  SetPlayerForEndGame() {
    if (!this.x01Settings.legbased) {
      for (let p of this.players) {
        p.setstats();
      }
    }
    this.setStats();
    this.service.deletePlayers();
    this.service.setGameIsActive(false);
  }

  winningPopup(player: X01Player) {
    this.service.showMessageFourWay('Congratulations', player.name + ' has won the game!', ['Home', this.x01Settings.num + ' Settings', 'Stats', ["Rematch"]]).then((res) => {
      if (res === "Home") {
        localStorage.removeItem('cricketPlayer');
        this.SetPlayerForEndGame();
        this.navCtrl.setRoot('HomePage');
      } else if (res === "New") {
        this.SetPlayerForEndGame();
        this.ionViewDidEnter();
      } else if (res === "Stats") {
        this.SetPlayerForEndGame();
        this.navCtrl.push('StatsPage');
      } else if (res == "Rematch") {
        this.prepareRematch();
      }
      this.service.createInterstitial();
    });
  }

  winningPopupLegbased(player: X01Player) {
    this.service.showMessageThreeWay('Congratulations', player.name + ' has won the game!', ['Home', 'Stats', this.x01Settings.num + ' Settings']).then((res) => {
      if (res === "Home") {
        localStorage.removeItem('cricketPlayer');
        this.SetPlayerForEndGame();
        this.navCtrl.setRoot('HomePage');
      } else if (res === "Stats") {
        this.SetPlayerForEndGame();
        this.navCtrl.push('StatsPage');
      } else if (res === "New") {
        this.SetPlayerForEndGame();
        this.ionViewDidEnter();
      }
      this.service.createInterstitial();
    });
  }


  prepareRematch() {
    for (let p of this.players) {
      p.prepareRematch(this.x01Settings.num);
    }
    this.isDouble = false;
    this.isTriple = false;
    this.throwCounter = 0;
    this.playerCounter = 0;
    this.gameOver = false;
    this.actionStack = new Stack<x01ThrowAction>()
    this.activePlayer = this.players[this.playerCounter];
    this.slides.slideTo(this.playerCounter, 1000);
    this.bannerRematch();
  }

  bannerRematch() {
    this.service.toastPopup('playerToastLeg', 'Rematch!');
  }


  winningLegToast(name: String) {
    this.service.toastPopup('playerToastLeg', name + '  has won a leg!');
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


  presentQuickStats() {
    let popover = this.popoverCtrl.create(Quickstatsx01Component, { key1: this.players, key2: this.currentleg, key3: this.currentset, key4: this.x01Settings.legbased });
    this.pageName = 'POPOVER'
    popover.present({
      // ev: this.players
    });
    popover.onDidDismiss(data => {
      this.pageName = '';
    });
  }
}
