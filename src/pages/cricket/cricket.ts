import { CricketPoint } from './../../models/cricketPoint';
import { CricketPlayer } from './../../models/cricketPlayer';
import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams, ModalController, Modal, ModalOptions } from 'ionic-angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Player } from '../../models/player';
import { ServiceProvider } from '../../providers/service/service';
import { HomePage } from '../home/home';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public admob: AdMobFree, public modalCtrl: ModalController,
    private service: ServiceProvider, private vibration: Vibration,
    public alertController: AlertController) {
  }

  ionViewDidLoad() {
    this.openModal();
  }
  async ionViewCanLeave() {
    const shouldLeave = await this.confirmLeave();
    return shouldLeave;
  }

  ionViewWillLeave() {
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
      if (data == true)
        this.navCtrl.push(HomePage, {}, { animate: true, direction: 'back' });
      else {
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

    this.players[id - 1].throwCricket(point, this.throwAmount);
    if (point.player.totalScore > this.currentHighscore)
      this.currentHighscore = point.player.totalScore;

    if (this.hasWon(point.player))
      this.winningPopup(point.player);

    this.isDouble = false;
    this.isTriple = false;
  }

  undo() {
    console.log("undo");
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
}