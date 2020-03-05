import { bobThrowAction } from '../../models/bob/bobThrowAction';
import { bobPlayer } from '../../models/bob/bobPlayer';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ServiceProvider } from '../../providers/service/service';
import { Stack } from 'stack-typescript';
import { Bobstats } from '../../models/bob/bobstats';
import { QuickstatscricketComponent } from '../../components/quickstatscricket/quickstatscricket';



@IonicPage()
@Component({
  selector: 'page-bob',
  templateUrl: 'bob.html',
})
export class BobPage {
  pageName = '';
  players: Array<bobPlayer> = new Array<bobPlayer>();
  containerofThree: number[] = [3, 2, 1];
  throwAmount: number = 1; // Factor for double and triple multiplication
  actionStack: Stack<bobThrowAction> = new Stack<bobThrowAction>();
  appSettings: any;
  showContent: boolean = false;
  bobStats: Bobstats[] = [];
  activePlayer: bobPlayer;
  playerCounter: number = 0;
  currentHighscore: number = 0;
  constructor(public popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, private service: ServiceProvider, private vibration: Vibration) { }

  ionViewDidEnter() {
    if (localStorage.getItem('bobStorage')) {
      this.openPopupRestore();
    } else {
      this.openSettingsModal();
    }
    this.service.setActivePage("Bob´s 27");
    this.getStatsStorage();
    this.appSettings = this.service.getAppSettings();
  }

  async ionViewCanLeave() {
    if (this.service.getGameIsActive()) {
      this.storeGame();
      this.showGameStored();
      return true;
    }
  }

  getStatsStorage() {
    if (localStorage.getItem('bobstats') === null) {
      this.bobStats.push(new Bobstats(0));
    } else {
      this.bobStats = JSON.parse(localStorage.getItem('bobstats'));
      this.bobStats.push(new Bobstats(this.bobStats.length));
    }
  }
  writeStatsInStorage() {
    localStorage.setItem('bobstats', JSON.stringify(this.bobStats));
  }

  storeGame() {
    localStorage.setItem('bobStorage', JSON.stringify({
      "players": this.players,
      "throwAmount": this.throwAmount,
      "playerCounter": this.playerCounter,
      "activePlayer": this.activePlayer,
      "appSettings": this.appSettings,
      "showContent": this.showContent,
      "currentHighscore": this.currentHighscore,

    }));
    localStorage.setItem('bobStack', JSON.stringify(this.actionStack.toArray()));
    this.service.setGameIsActive(false);
    this.service.deletePlayers();
  }

  openSettingsModal() {
    this.deleteAll();
    this.deleteStorage();
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    const myModal: Modal = this.modalCtrl.create("BobSettingsPage");
    myModal.present();
    myModal.onDidDismiss(data => {
      if (data == false) {
        this.service.setGameIsActive(false);
        this.navCtrl.setRoot('HomePage');
      }
      else if (data == true) {
        this.showContent = true;
        this.players = this.service.getAllPlayer() as bobPlayer[];
        // this.setPlayer();
        this.service.setGameIsActive(true);
        this.setGame();

      }
    });
  }

  deleteAll() {
    this.players = [];
    this.service.deletePlayers();
    this.throwAmount = 0;
    this.currentHighscore = 0;
    this.actionStack = new Stack<bobThrowAction>();
  }

  setStats() {
    this.bobStats[this.bobStats.length - 1].date = new Date();
    this.bobStats[this.bobStats.length - 1].players = this.players;
    this.writeStatsInStorage();
  }

  throw(point: number) {
    var action = new bobThrowAction(point, this.activePlayer);
    this.actionStack.push(action);
    action.do();
    if (this.checkForWins(this.activePlayer)) {
      this.activePlayer.counterWonGames++;
      this.winningPopup(this.activePlayer);
      return;
    }
    if (this.checkforLose(this.activePlayer)) {
      this.loosingPopup(this.activePlayer);
      return;
    }

    if (this.activePlayer.roundThrowCount == 3) {

      this.playerCounter = (this.playerCounter + 1) % this.players.length;
      this.activePlayer = this.players[this.playerCounter];
      this.activePlayer.resetForTurn();
    }
  }

  checkForWins(p: bobPlayer) {
    if (p.totalScore > this.currentHighscore) {
      this.currentHighscore = p.totalScore;
    }

    if (p.toThrow > 21)
      return p.totalScore >= this.currentHighscore;
    else
      return false;
  }

  checkforLose(p: bobPlayer) {
    return p.totalScore < 0;
  }

  undo() {
    var action = this.actionStack.pop();
    if (action != null) {
      if (this.activePlayer.roundThrowCount == 0) {
        this.playerCounter = (this.playerCounter - 1) < 0 ? this.players.length - 1 : (this.playerCounter - 1)
        this.activePlayer = this.players[this.playerCounter];
      }
      action.undo();
    }
  }

  newgame() {
    this.openPopupNewGame();
  }

  getActivePlayer() {

    if (this.activePlayer)
      return true
    else return false;
  }

  getToThrow(id: number) {
    for (let i = 0; i < this.players.length; i++) {
      if (id == this.players[i].id) {
        if (this.players[i].toThrow > 20)
          return "DB";
        else
          return "D" + this.players[i].toThrow;
      }
    }
  }
  isActivePlayer(id: number) {
    if (this.activePlayer)
      return id == this.activePlayer.id;
    else return false;
  }

  vibrate() {
    if (this.appSettings.vibrate) {
      this.vibration.vibrate(13);
    } else {
    }
  }

  deleteStorage() {
    localStorage.removeItem('bobStorage');
    localStorage.removeItem('bobStack');
  }

  restoreGame() {
    let apwStorage = JSON.parse(localStorage.getItem('bobStorage'));

    this.throwAmount = apwStorage.throwAmount;
    this.playerCounter = apwStorage.playerCounter;
    this.appSettings = apwStorage.appSettings;
    this.showContent = apwStorage.showContent;
    this.currentHighscore = apwStorage.currentHighscore;

    this.players = [];
    for (let p of apwStorage.players) {
      let tmpPlayer = new bobPlayer(p.id, p.name)
      Object.assign(tmpPlayer, {
        "totalScore": p.totalScore,
        "roundThrowCount": p.roundThrowCount,
        "totalThrowCount": p.totalThrowCount,
        "avg": p.avg,
        "pointCounter": p.pointCounter,
        "pointCounterPerGame": p.pointCounterPerGame,
        "avgPerGame": p.avgPerGame,
        "counterWonGames": p.counterWonGames,
        "toThrow": p.toThrow,
        "hitCounter": p.hitCounter,
        "totalScoresPerGame": p.totalScoresPerGame,
      });
      this.players.push(tmpPlayer);
    }
    // this.setPlayer();

    let tmp: Array<bobThrowAction> = JSON.parse(localStorage.getItem('bobStack'));

    for (let tmpAct of tmp.reverse()) {
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].id == tmpAct.player.id)
          tmpAct.player = this.players[i];
      }
      var act = new bobThrowAction(tmpAct.point, tmpAct.player)
      Object.assign(act, {
        "isDone": tmpAct.isDone,
      });
      this.actionStack.push(act);
    }
    this.activePlayer = this.players[this.playerCounter];

    this.deleteStorage();
    this.service.setGameIsActive(true);
    this.gameRestoreToast();
  }

  setGame() {
    this.playerCounter = 0;
    this.activePlayer = this.players[0];
  }

  prepareRematch() {
    this.players.forEach(function (p) {
      p.prepareRematch();
    });
    this.throwAmount = 1; // Factor for double and triple multiplication
    this.playerCounter = 0;
    this.currentHighscore = 0;

    this.activePlayer = this.players[this.playerCounter];
    this.actionStack = new Stack<bobThrowAction>();
    this.bannerRematch();
  }
  SetPlayerForEndGame() {
    for (let p of this.players) {
      p.setStats();
    }
    this.setStats();
    this.service.deletePlayers();
    this.service.setGameIsActive(false);
  }

  // POPUPS //

  winningPopup(player: bobPlayer) {
    this.service.showMessageFourWay('Congratulations', player.name + ' has won the game!', ['Home', 'Bob´s 27 Settings', 'Stats', ["Rematch"]]).then((res) => {
      if (res === "Home") {
        this.SetPlayerForEndGame();
        localStorage.removeItem('bobPlayer');
        this.service.deletePlayers();
        this.service.setGameIsActive(false);
        this.navCtrl.setRoot('HomePage');
      } else if (res === "New") {
        this.SetPlayerForEndGame();
        this.service.deletePlayers();
        this.service.setGameIsActive(false);
        this.ionViewDidEnter();
      } else if (res === "Stats") {
        this.SetPlayerForEndGame();
        this.service.deletePlayers();
        this.service.setGameIsActive(false);
        this.navCtrl.push('StatsPage');
      } else if (res == "Rematch") {
        this.prepareRematch();
      }
      this.service.createInterstitial();
    });
  }
  loosingPopup(player: bobPlayer) {
    this.service.showMessageFourWay('Game Over', player.name + ' has lost the game!', ['Home', 'Bob´s 27 Settings', 'Stats', ["Rematch"]]).then((res) => {
      if (res === "Home") {
        this.SetPlayerForEndGame();
        localStorage.removeItem('bobPlayer');
        this.service.deletePlayers();
        this.service.setGameIsActive(false);
        this.navCtrl.setRoot('HomePage');
      } else if (res === "New") {
        this.SetPlayerForEndGame();
        this.service.deletePlayers();
        this.service.setGameIsActive(false);
        this.ionViewDidEnter();
      } else if (res === "Stats") {
        this.SetPlayerForEndGame();
        this.service.deletePlayers();
        this.service.setGameIsActive(false);
        this.navCtrl.push('StatsPage');
      } else if (res == "Rematch") {
        this.prepareRematch();
      }
      this.service.createInterstitial();
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
    this.service.showMessageOkCancel('Restore Bob´s 27?', 'Do you want to restore the last game?', ['New game', 'Yes']).then((res) => {
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
  async bannerRematch() {
    this.service.toastPopup('playerToast', 'Rematch!');
  }

  presentQuickStats() {
    let popover = this.popoverCtrl.create(QuickstatscricketComponent, { key1: this.players });
    this.pageName = 'POPOVER'
    popover.present({
      // ev: this.players
    });
    popover.onDidDismiss(data => {
      this.pageName = '';
    });
  }
}