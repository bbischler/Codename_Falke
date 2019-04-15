import { throwCricketAction } from './../../models/throwAction';
import { CricketPoint } from './../../models/cricketPoint';
import { CricketPlayer } from './../../models/cricketPlayer';
import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Player } from '../../models/player';
import { ServiceProvider } from '../../providers/service/service';
import { HomePage } from '../home/home';
import { Stack } from 'stack-typescript';
import { CricketStorage } from '../../models/cricketStorage';


@IonicPage()
@Component({
  selector: 'page-cricket',
  templateUrl: 'cricket.html',
})
export class CricketPage {

  cricketStorage: CricketStorage;
  players: Array<CricketPlayer> = new Array<CricketPlayer>();
  isDouble: Boolean = false;
  isTriple: Boolean = false;
  currentHighscore: number = 0;
  containerofThree: number[] = [3, 2, 1];
  throwAmount: number = 1; // Factor for double and triple multiplication
  actionStack: Stack<throwCricketAction> = new Stack<throwCricketAction>();


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public admob: AdMobFree, public modalCtrl: ModalController,
    private service: ServiceProvider, private vibration: Vibration,
    public alertController: AlertController) { }

  ionViewDidEnter() {
    if (localStorage.getItem('cricketStorage')) {
      this.openModalRestore();
    } else {
      localStorage.removeItem('cricketStorage');
      this.openModal();
    }
  }

  async ionViewCanLeave() {
    if (this.service.getGameIsActive()) {
      const shouldLeave = await this.confirmLeave();
      return shouldLeave;
    }
  }

  ionViewWillLeave() {

    let _cricketStorage = new CricketStorage(this.players, this.isDouble, this.isTriple, this.currentHighscore, this.throwAmount);
    localStorage.setItem('cricketStorage', JSON.stringify(_cricketStorage));
    // for (let item of this.actionStack.toArray()) {
    localStorage.setItem('cricketStack', JSON.stringify(this.actionStack.toArray()));
    // }
    console.log('cricketStorage wurde gesetzt!');


    this.service.setGameIsActive(false);
    this.service.deletePlayers();
  }

  openModal() {
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
        this.setPlayer();
        this.service.setGameIsActive(true);
      }
    });
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

    // var action = this.players[id - 1].throwCricket(point, this.throwAmount);
    var action = new throwCricketAction(point.value, this.throwAmount, this.players[id - 1]);
    this.actionStack.push(action);
    action.do();

    if (this.players[id - 1].totalScore > this.currentHighscore)
      this.currentHighscore = this.players[id - 1].totalScore;

    if (this.hasWon(this.players[id - 1]))
      this.winningPopup(this.players[id - 1]);

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
      return true;
    } else {
      return false;
    }
  }

  setPlayer() {
    console.log(typeof (this.players));
    this.players = this.service.getAllPlayer() as CricketPlayer[];
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
    this.vibration.vibrate(13);
  }

  restoreGame() {
    this.cricketStorage = JSON.parse(localStorage.getItem('cricketStorage'));
    this.players = this.cricketStorage.players;
    this.isDouble = this.cricketStorage.isDouble;
    this.isTriple = this.cricketStorage.isTriple;
    this.currentHighscore = this.cricketStorage.currentHighscore;
    this.throwAmount = this.cricketStorage.throwAmount;
    let tmp = JSON.parse(localStorage.getItem('cricketStack'))
    console.log(tmp);
    for (let i of tmp) {
      this.actionStack.push(i);
      console.log("parsing stack");
    }
    localStorage.removeItem('cricketStorage');
    localStorage.removeItem('cricketStack');

  }

  winningPopup(player: CricketPlayer) {
    let alert = this.alertController.create({
      title: 'Congratulations',
      message: player.name + ' has won the game!',

      buttons: [
        {
          text: 'Home',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'New Game',
          handler: data => {
            console.log('new game');
          }
        }
      ]
    });
    alert.present();
  }

  confirmLeave(): Promise<Boolean> {
    let resolveLeaving;
    const canLeave = new Promise<Boolean>(resolve => resolveLeaving = resolve);
    const alert = this.alertController.create({
      title: 'Leaving game',
      message: 'Do you want to leave the page? <br> The game will be stored.',
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

  openModalRestore() {
    let alert = this.alertController.create({
      title: 'Restore game',
      message: 'Do you want to restore the last game?',

      buttons: [
        {
          text: 'No',
          handler: data => {
            this.openModal();
          }
        },
        {
          text: 'Yes',
          handler: data => {
            this.restoreGame();
          }
        }
      ]
    });
    alert.present();
  }
}