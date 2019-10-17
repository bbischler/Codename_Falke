import { cricketThrowAction } from './../../models/cricketThrowAction';
import { CricketPoint } from './../../models/cricketPoint';
import { CricketPlayer } from './../../models/cricketPlayer';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ServiceProvider } from '../../providers/service/service';
import { Stack } from 'stack-typescript';

@IonicPage()
@Component({
  selector: 'page-cricket',
  templateUrl: 'cricket.html',
})
export class CricketPage {
  players: Array<CricketPlayer> = new Array<CricketPlayer>();
  isDouble: Boolean = false;
  isTriple: Boolean = false;
  currentHighscore: number = 0;
  containerofThree: number[] = [3, 2, 1];
  throwAmount: number = 1; // Factor for double and triple multiplication
  actionStack: Stack<cricketThrowAction> = new Stack<cricketThrowAction>();
  appSettings: any;
  showContent: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, private service: ServiceProvider, private vibration: Vibration) { }

  ionViewDidEnter() {
    if (localStorage.getItem('cricketStorage')) {
      this.openPopupRestore();
    } else {
      this.openSettingsModal();
    }
    this.service.setActivePage("Cricket");
    this.appSettings = this.service.getAppSettings();
  }

  async ionViewCanLeave() {
    if (this.service.getGameIsActive()) {
      // const shouldLeave = await this.confirmLeave();
      // if (shouldLeave)
      // this.storeGame();
      this.storeGame();
      this.showGameStored();
      return true;
    }
  }

  storeGame() {
    localStorage.setItem('cricketStorage', JSON.stringify({
      "players": this.players,
      "isDouble": this.isDouble,
      "isTriple": this.isTriple,
      "currentHighscore": this.currentHighscore,
      "throwAmount": this.throwAmount
    }));
    localStorage.setItem('cricketStack', JSON.stringify(this.actionStack.toArray()));
    console.log('cricket Storage wurde gesetzt!');
    this.service.setGameIsActive(false);
    this.service.deletePlayers();
    console.log("STOARGE: " + localStorage.getItem('cricketStorage'));
  }

  openSettingsModal() {
    this.deleteAll();
    this.deleteStorage();
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    const myModal: Modal = this.modalCtrl.create("CricketSettingsPage");
    myModal.present();
    myModal.onDidDismiss(data => {
      if (data == false) {
        this.service.setGameIsActive(false);
        this.navCtrl.setRoot('HomePage');
      }
      else if (data == true) {
        this.showContent = true;
        this.players = this.service.getAllPlayer() as CricketPlayer[];
        this.setPlayer();
        this.service.setGameIsActive(true);
      }
    });
  }

  deleteAll() {
    this.players = [];
    this.service.deletePlayers();
    this.throwAmount = 0;
    this.isDouble = false;
    this.isTriple = false;
    this.actionStack = new Stack<cricketThrowAction>();
    this.currentHighscore = 0;
  }

  addPoints(point: CricketPoint, id: number) {
    this.throwAmount = this.getThrowAmount();
    if (this.throwAmount == 3 && point.value == 25) {
      this.TripleBullToast();
      this.resetModifiers();
      return;
    }
    this.vibrate();

    var action = new cricketThrowAction(point.value, this.throwAmount, this.players[id - 1]);
    this.actionStack.push(action);
    action.do();

    this.checkForWins(id);
    this.resetModifiers();
  }

  checkForWins(activePlayerId: number) {
    var player = this.players[activePlayerId - 1];

    if (player.totalScore > this.currentHighscore) {
      this.currentHighscore = player.totalScore;
    }
    if (this.hasWon(player)) {
      this.service.deletePlayers();
      this.service.setGameIsActive(false);
      this.winningPopup(player);
      return;
    }
  }

  resetModifiers() {
    this.isDouble = false;
    this.isTriple = false;
  }

  getThrowAmount(): number {
    if (this.isDouble) {
      return 2;
    }
    if (this.isTriple) {
      return 3;
    }
    return 1;
  }

  undo() {
    console.log("Undo prompted")
    var action = this.actionStack.pop();
    if (action != null)
      action.undo();
  }

  newgame() {
    console.log("newgame");
    this.openPopupNewGame();
  }

  double() {
    this.isTriple = false;
    this.isDouble = !this.isDouble;
  }

  trible() {
    this.isDouble = false;
    this.isTriple = !this.isTriple;
  }

  hasWon(player: CricketPlayer): Boolean {
    if (player.points.some(p => !p.isClosed)) {
      return false;
    }
    return player.totalScore >= this.currentHighscore;
  }

  setPlayer() {
    console.log(typeof (this.players));
    function flatten(a, b) { return a.concat(b); }
    for (let player of this.players) {
      for (let point of player.points) {

        // onClosed - Handler
        point.registerOnClosed((value, isClosed) => {
          var allClosed: Boolean = true;
          var pointsToCheck = (this.players.map(p => p.points)
            .reduce(flatten, []) as CricketPoint[])
            .filter(p => p.value == value);
          var sumOfClosed = pointsToCheck.map(p => (p.isClosed ? 0 : 1) as number)
            .reduce((sum, current) => sum + current);
          for (let point of pointsToCheck) {
            point.setIsClosed = (sumOfClosed == 0);
          }
        });
      }
    }
  }

  vibrate() {
    if (this.appSettings.vibrate) {
      console.log("vibrate");
      this.vibration.vibrate(13);
    } else {
      console.log("no vibrate");
    }
  }

  deleteStorage() {
    console.log("delete storage");
    localStorage.removeItem('cricketStorage');
    localStorage.removeItem('cricketStack');
  }

  restoreGame() {
    console.log("restore storage");
    let cStorage = JSON.parse(localStorage.getItem('cricketStorage'));

    this.isDouble = cStorage.isDouble;
    this.isTriple = cStorage.isTriple;
    this.currentHighscore = cStorage.currentHighscore;
    this.throwAmount = cStorage.throwAmount;
    this.players = [];
    for (let p of cStorage.players) {
      let tmpPlayer = new CricketPlayer(p.id, p.name)
      Object.assign(tmpPlayer, {
        "totalScore": p.totalScore,
        "roundThrowCount": p.roundThrowCount,
        "totalThrowCount": p.totalThrowCount
      });
      tmpPlayer.setPoints(p.points);
      this.players.push(tmpPlayer);
    }
    this.setPlayer();

    let tmp: Array<cricketThrowAction> = JSON.parse(localStorage.getItem('cricketStack'));

    for (let tmpAct of tmp.reverse()) {
      tmpAct.player = this.players[tmpAct.player.id - 1];
      var act = new cricketThrowAction(tmpAct.point, tmpAct.amount, tmpAct.player)
      Object.assign(act, {
        "isDone": tmpAct.isDone,
        "totalNumberOfPointIncreases": tmpAct.totalNumberOfPointIncreases,
        "totalScoreIncrease": tmpAct.totalScoreIncrease
      });
      this.actionStack.push(act);
    }

    this.deleteStorage();
    this.service.setGameIsActive(true);
    this.gameRestoreToast();
  }


  // POPUPS //

  winningPopup(player: CricketPlayer) {
    this.service.showMessageOkCancel('Congratulations', player.name + ' has won the game!', ['Home', 'New Game']).then((res) => {
      if (res) {
        this.ionViewDidEnter();
      } else {
        localStorage.removeItem('cricketPlayer');
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

  openPopupNewGame() {
    this.service.showMessageOkCancel('New Game', 'Do you want to start a new game?', ['Cancel', 'Yes']).then((res) => {
      if (res) {
        this.deleteAll();
        this.openSettingsModal();
      } else {
        return;
      }
    });
  }

  openPopupRestore() {
    this.service.showMessageOkCancel('Restore cricket?', 'Do you want to restore the last game?', ['New game', 'Yes']).then((res) => {
      if (res) {
        this.restoreGame();
        this.showContent = true;
      } else {
        this.openSettingsModal();
      }
    });
  }

  async gameRestoreToast() {
    this.service.toastPopup('playerToast', 'Game restored!');
  }

  async TripleBullToast() {
    this.service.toastPopup('playerToast', 'Triple Bull not allowed');
  }

  async showGameStored() {
    this.service.toastPopup('playerToast', 'Game is stored');
  }

}