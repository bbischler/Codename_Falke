import { cricketThrowAction } from '../../models/cricket/cricketThrowAction';
import { CricketPoint } from '../../models/cricket/cricketPoint';
import { CricketPlayer } from '../../models/cricket/cricketPlayer';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ServiceProvider } from '../../providers/service/service';
import { Stack } from 'stack-typescript';
import { Cricketstats } from '../../models/cricket/cricketstats';
// import { QuickstatscricketComponent } from '../../components/quickstatscricket/quickstatscricket';



@IonicPage()
@Component({
  selector: 'page-cricket',
  templateUrl: 'cricket.html',
})
export class CricketPage {
  pageName = '';
  players: Array<CricketPlayer> = new Array<CricketPlayer>();
  isDouble: Boolean = false;
  isTriple: Boolean = false;
  currentHighscore: number = 0;
  containerofThree: number[] = [3, 2, 1];
  throwAmount: number = 1; // Factor for double and triple multiplication
  actionStack: Stack<cricketThrowAction> = new Stack<cricketThrowAction>();
  appSettings: any;
  showContent: boolean = false;
  cricketstats: Cricketstats[] = [];
  activePlayer: CricketPlayer;
  playerCounter: number = 0;

  constructor(public popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, private service: ServiceProvider, private vibration: Vibration) { }

  ionViewDidEnter() {
    if (localStorage.getItem('cricketStorage')) {
      this.openPopupRestore();
    } else {
      this.openSettingsModal();
    }
    this.service.setActivePage("Cricket");
    this.getStatsStorage();
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

  getStatsStorage() {
    if (localStorage.getItem('cricketstats') === null) {
      this.cricketstats.push(new Cricketstats(0));
    } else {
      this.cricketstats = JSON.parse(localStorage.getItem('cricketstats'));
      this.cricketstats.push(new Cricketstats(this.cricketstats.length));
    }
  }
  writeStatsInStorage() {
    localStorage.setItem('cricketstats', JSON.stringify(this.cricketstats));
  }

  storeGame() {
    localStorage.setItem('cricketStorage', JSON.stringify({
      "players": this.players,
      "isDouble": this.isDouble,
      "isTriple": this.isTriple,
      "currentHighscore": this.currentHighscore,
      "throwAmount": this.throwAmount,
      "playerCounter": this.playerCounter,
      "activePlayer": this.activePlayer,
      "appSettings": this.appSettings,
      "showContent": this.showContent,
    }));
    localStorage.setItem('cricketStack', JSON.stringify(this.actionStack.toArray()));
    this.service.setGameIsActive(false);
    this.service.deletePlayers();
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
        this.setGame();
      }
    });
  }
  setGame() {
    this.playerCounter = 0;
    this.activePlayer = this.players[0];
  }
  isActivePlayer(id: number) {
    if (this.activePlayer)
      return id == this.activePlayer.id;
    else return false;
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

  setStats() {
    this.cricketstats[this.cricketstats.length - 1].date = new Date();
    this.cricketstats[this.cricketstats.length - 1].players = this.players;
    this.writeStatsInStorage();
  }

  SetPlayerForEndGame() {
    for (let p of this.players) {
      p.setStats();
    }
    this.setStats();
    this.service.deletePlayers();
    this.service.setGameIsActive(false);
  }


  addPoints(point: number) {
    this.throwAmount = this.getThrowAmount();
    if (this.throwAmount == 3 && point == 25) {
      this.TripleBullToast();
      this.resetModifiers();
      return;
    }
    this.vibrate();

    var action = new cricketThrowAction(point, this.throwAmount, this.activePlayer);
    this.actionStack.push(action);
    action.do();

    this.checkForWins(this.activePlayer);
    this.resetModifiers();


    if (this.activePlayer.roundThrowCount == 3) {
      this.playerCounter = (this.playerCounter + 1) % this.players.length;
      this.activePlayer = this.players[this.playerCounter];
      this.activePlayer.resetForTurn();
    }
  }

  checkForWins(player: CricketPlayer) {
    if (player.totalScore > this.currentHighscore) {
      this.currentHighscore = player.totalScore;
    }
    if (this.hasWon(player)) {
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
      this.vibration.vibrate(13);
    } else {
    }
  }

  deleteStorage() {
    localStorage.removeItem('cricketStorage');
    localStorage.removeItem('cricketStack');
  }

  restoreGame() {
    let cStorage = JSON.parse(localStorage.getItem('cricketStorage'));

    this.isDouble = cStorage.isDouble;
    this.isTriple = cStorage.isTriple;
    this.currentHighscore = cStorage.currentHighscore;
    this.throwAmount = cStorage.throwAmount;
    this.playerCounter = cStorage.playerCounter;
    this.activePlayer = cStorage.activePlayer;
    this.appSettings = cStorage.appSettings;
    this.showContent = cStorage.showContent;
    this.players = [];
    for (let p of cStorage.players) {
      let tmpPlayer = new CricketPlayer(p.id, p.name)
      Object.assign(tmpPlayer, {
        "totalScore": p.totalScore,
        "roundThrowCount": p.roundThrowCount,
        "totalThrowCount": p.totalThrowCount,
        "totalScoresPerGame": p.totalScoresPerGame,
        "pointsPerGame": p.pointsPerGame,
        "avg": p.avg,
        "avgPerGame": p.avgPerGame,
        "missCounter": p.missCounter,
      });
      tmpPlayer.setPoints(p.points);
      this.players.push(tmpPlayer);
    }
    this.setPlayer();

    let tmpStack: Array<cricketThrowAction> = JSON.parse(localStorage.getItem('cricketStack'));

    for (let tmpAct of tmpStack.reverse()) {
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].id == tmpAct.player.id)
          tmpAct.player = this.players[i];
      }
      var act = new cricketThrowAction(tmpAct.point, tmpAct.amount, tmpAct.player)
      Object.assign(act, {
        "isDone": tmpAct.isDone,
        "totalNumberOfPointIncreases": tmpAct.totalNumberOfPointIncreases,
        "totalScoreIncrease": tmpAct.totalScoreIncrease
      });
      this.actionStack.push(act);
    }
    this.activePlayer = this.players[this.playerCounter];

    this.deleteStorage();
    this.service.setGameIsActive(true);
    this.gameRestoreToast();
  }

  prepareRematch() {
    this.players.forEach(function (p) {
      p.prepareRematch();
    });
    this.isDouble = false;
    this.isTriple = false;
    this.currentHighscore = 0;
    this.throwAmount = 1; // Factor for double and triple multiplication
    this.actionStack = new Stack<cricketThrowAction>();
    this.playerCounter = 0;
    this.activePlayer = this.players[this.playerCounter];
    this.setPlayer();
    this.bannerRematch();
  }


  getActivePlayer() {
    if (this.activePlayer)
      return true
    else return false;
  }

  // POPUPS //

  winningPopup(player: CricketPlayer) {
    this.service.showMessageFourWay('Congratulations', player.name + ' has won the game!', ['Home', 'Cricket Settings', 'Stats', ["Rematch"]]).then((res) => {
      if (res === "Home") {
        this.SetPlayerForEndGame();
        localStorage.removeItem('cricketPlayer');
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
  async bannerRematch() {
    this.service.toastPopup('playerToast', 'Rematch!');
  }

  presentQuickStats() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: true,
      showBackdrop: true,
      cssClass: 'stats-modal'
    };
    const myModal: Modal = this.modalCtrl.create("QuickstatsCricketModalPage", { players: this.players }, myModalOptions);
    myModal.present();
  }
}