import { atwThrowAction } from '../../models/atw/atwThrowAction';
import { atwPlayer } from '../../models/atw/atwPlayer';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ServiceProvider } from '../../providers/service/service';
import { Stack } from 'stack-typescript';
import { Atwstats } from '../../models/atw/atwstats';
import { QuickstatscricketComponent } from '../../components/quickstatscricket/quickstatscricket';



@IonicPage()
@Component({
  selector: 'page-aroundWorld',
  templateUrl: 'aroundWorld.html',
})
export class AroundWorldPage {
  pageName = '';
  players: Array<atwPlayer> = new Array<atwPlayer>();
  containerofThree: number[] = [3, 2, 1];
  throwAmount: number = 1; // Factor for double and triple multiplication
  actionStack: Stack<atwThrowAction> = new Stack<atwThrowAction>();
  appSettings: any;
  showContent: boolean = false;
  atwStats: Atwstats[] = [];
  activePlayer: atwPlayer;
  playerCounter: number = 0;

  constructor(public popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, private service: ServiceProvider, private vibration: Vibration) { }

  ionViewDidEnter() {
    if (localStorage.getItem('atwStorage')) {
      this.openPopupRestore();
    } else {
      this.openSettingsModal();
    }
    this.service.setActivePage("Around The World");
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
    if (localStorage.getItem('atwstats') === null) {
      this.atwStats.push(new Atwstats(0));
    } else {
      this.atwStats = JSON.parse(localStorage.getItem('atwstats'));
      this.atwStats.push(new Atwstats(this.atwStats.length));
    }
  }
  writeStatsInStorage() {
    localStorage.setItem('atwstats', JSON.stringify(this.atwStats));
  }

  storeGame() {
    localStorage.setItem('atwStorage', JSON.stringify({
      "players": this.players,
      "throwAmount": this.throwAmount,
      "playerCounter": this.playerCounter,
      "activePlayer": this.activePlayer,
      "appSettings": this.appSettings,
      "showContent": this.showContent,
    }));
    localStorage.setItem('atwStack', JSON.stringify(this.actionStack.toArray()));
    this.service.setGameIsActive(false);
    this.service.deletePlayers();
  }

  openSettingsModal() {
    this.deleteAll();
    this.deleteStorage();
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    const myModal: Modal = this.modalCtrl.create("AroundWorldSettingsPage");
    myModal.present();
    myModal.onDidDismiss(data => {
      if (data == false) {
        this.service.setGameIsActive(false);
        this.navCtrl.setRoot('HomePage');
      }
      else if (data == true) {
        this.showContent = true;
        this.players = this.service.getAllPlayer() as atwPlayer[];
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
    this.actionStack = new Stack<atwThrowAction>();
  }

  setStats() {
    this.atwStats[this.atwStats.length - 1].date = new Date();
    this.atwStats[this.atwStats.length - 1].players = this.players;
    this.writeStatsInStorage();
  }

  throw(point: number) {
    var action = new atwThrowAction(point, this.activePlayer);
    this.actionStack.push(action);
    action.do();
    if (this.checkForWins(this.activePlayer)) {
      this.activePlayer.counterWonGames++;
      this.winningPopup(this.activePlayer);
      return;
    }

    if (this.activePlayer.roundThrowCount == 3) {
      this.playerCounter = (this.playerCounter + 1) % this.players.length;
      this.activePlayer = this.players[this.playerCounter];
      this.activePlayer.resetForTurn();
    }
  }

  checkForWins(p: atwPlayer) {
    return p.totalScore > 21;
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

  getActivePlayer() {

    if (this.activePlayer)
      return true
    else return false;
  }

  getToThrow(id: number) {
    for (let i = 0; i < this.players.length; i++) {
      if (id == this.players[i].id) {
        if (this.players[i].totalScore > 20)
          return "Bull";
        else
          return this.players[i].totalScore;
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
    localStorage.removeItem('atwStorage');
    localStorage.removeItem('atwStack');
  }

  restoreGame() {
    let apwStorage = JSON.parse(localStorage.getItem('atwStorage'));

    this.throwAmount = apwStorage.throwAmount;
    this.playerCounter = apwStorage.playerCounter;
    this.appSettings = apwStorage.appSettings;
    this.showContent = apwStorage.showContent;

    this.players = [];
    for (let p of apwStorage.players) {
      let tmpPlayer = new atwPlayer(p.id, p.name)
      Object.assign(tmpPlayer, {
        "totalScore": p.totalScore,
        "roundThrowCount": p.roundThrowCount,
        "totalThrowCount": p.totalThrowCount,
        "avg": p.avg,
        "pointCounter": p.pointCounter,
        "avgPerGame": p.avgPerGame,
        "counterWonGames": p.counterWonGames,
      });
      this.players.push(tmpPlayer);
    }
    // this.setPlayer();

    let tmp: Array<atwThrowAction> = JSON.parse(localStorage.getItem('atwStack'));

    for (let tmpAct of tmp.reverse()) {
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].id == tmpAct.player.id)
          tmpAct.player = this.players[i];
      }
      var act = new atwThrowAction(tmpAct.point, tmpAct.player)
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
    this.activePlayer = this.players[this.playerCounter];
    this.actionStack = new Stack<atwThrowAction>();
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

  winningPopup(player: atwPlayer) {
    this.service.showMessageFourWay('Congratulations', player.name + ' has won the game!', ['Home', 'Around The World Settings', 'Stats', ["Rematch"]]).then((res) => {
      if (res === "Home") {
        this.SetPlayerForEndGame();
        localStorage.removeItem('atwPlayer');
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
    this.service.showMessageOkCancel('Restore Around The World?', 'Do you want to restore the last game?', ['New game', 'Yes']).then((res) => {
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