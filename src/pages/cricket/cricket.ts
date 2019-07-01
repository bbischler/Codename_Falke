import { cricketThrowAction } from './../../models/cricketThrowAction';
import { CricketPoint } from './../../models/cricketPoint';
import { CricketPlayer } from './../../models/cricketPlayer';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ServiceProvider } from '../../providers/service/service';
import { HomePage } from '../home/home';
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
      const shouldLeave = await this.confirmLeave();
      if (shouldLeave)
        this.storeGame();
      return shouldLeave;
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
        this.navCtrl.setRoot(HomePage);
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
    this.throwAmount = 1;
    this.vibrate();

    if (this.isDouble) {
      this.throwAmount = 2;
    }
    if (this.isTriple) {
      this.throwAmount = 3;
    }

    var action = new cricketThrowAction(point.value, this.throwAmount, this.players[id - 1]);
    this.actionStack.push(action);
    action.do();

    if (this.players[id - 1].totalScore > this.currentHighscore)
      this.currentHighscore = this.players[id - 1].totalScore;

    if (this.hasWon(this.players[id - 1])) {
      this.winningPopup(this.players[id - 1]);
    }

    this.isDouble = false;
    this.isTriple = false;
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
    console.log(this.currentHighscore + ": " + player.totalScore);
    for (let point of player.points) {
      if (!point.isClosed)
        return false;
    }

    // berücksichtigt nicht edge case: player1 führt mit 100 punkten. player 2 holt auf und hat auch genau 100 dann gewinnt er..
    if (player.totalScore >= this.currentHighscore) {
      this.service.deletePlayers();
      this.service.setGameIsActive(false);
      return true;
    } else {
      return false;
    }
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
      let tmpPlayer = new CricketPlayer()
      Object.assign(tmpPlayer, {
        "totalScore": p.totalScore,
        "roundThrowCount": p.roundThrowCount,
        "totalThrowCount": p.totalThrowCount,
        "id": p.id,
        "name": p.name
      });
      tmpPlayer.setPoints(p.points);
      this.players.push(tmpPlayer);
    }
    this.setPlayer();

    let tmp = JSON.parse(localStorage.getItem('cricketStack'));
    for (let i of tmp) {
      let tmpAction = new cricketThrowAction();
      Object.assign(tmpAction, {
        "point": i.point,
        "amount": i.amount,
        "isDone": i.isDone,
        "totalScoreIncrease": i.totalScoreIncrease,
        "totalNumberOfPointIncreases": i.totalNumberOfPointIncreases
      });
      tmpAction.setPlayer(i.player);
      this.actionStack.push(tmpAction);
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
        this.navCtrl.setRoot(HomePage);
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
    this.service.showMessageOkCancel('Restore?', 'Do you want to restore the last game?', ['Cancel', 'Yes']).then((res) => {
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
}