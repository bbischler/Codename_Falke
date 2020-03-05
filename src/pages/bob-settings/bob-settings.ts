import { bobPlayer } from '../../models/bob/bobPlayer';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, PopoverController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { RulesComponent } from '../../components/rules/rules';

@IonicPage()
@Component({
  selector: 'page-bob-settings',
  templateUrl: 'bob-settings.html',
})
export class BobSettingsPage {
  players: bobPlayer[] = [];
  pageName = 'MODAL';
  reorder: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, private service: ServiceProvider,
    public toastController: ToastController, public popoverCtrl: PopoverController) {

    if (localStorage.getItem("bobPlayer")) {
      let tmpplayers = JSON.parse(localStorage.getItem("bobPlayer"));
      for (let p of tmpplayers) {
        this.players.push(new bobPlayer(p.id, p.name));
      }
      this.players = this.service.setPlayerIDs(this.players);
    }
    else {
      this.players.push(new bobPlayer(0, ""));
      this.players.push(new bobPlayer(1, ""));
    }

  }

  toggleReorder() {
    this.reorder = !this.reorder;
  } 
  openRules(mode: string) {
    let popover = this.popoverCtrl.create(RulesComponent, { key1: mode });
    this.pageName = 'POPOVER'
    popover.present({});
    popover.onDidDismiss(data => {
      this.pageName = 'MODAL';
    });
  }
  doReorder(event) {
    let draggedItem = this.players.splice(event.from, 1)[0];
    this.players.splice(event.to, 0, draggedItem)
  }
  resetSettings() {
    localStorage.removeItem("bobPlayer");
    this.players = [];
    this.players.push(new bobPlayer(0, ""));
    this.players.push(new bobPlayer(1, ""));
  }

  dismiss() {
    this.service.setActivePage('Home');
    this.viewCtrl.dismiss(false);
  }
  closeModal() {
    this.service.setActivePage('Home');
    this.viewCtrl.dismiss(false);
  }

  play() {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].name == "") {
        this.players[i].name = "Player " + (i + 1);
      }
      // this.players[i].setId(i);
      this.service.addPlayer(this.players[i]);
    }
    localStorage.setItem("bobPlayer", JSON.stringify(this.players));
    this.viewCtrl.dismiss(true);
  }

  ionViewDidLoad() {
  }

  addPlayer() {
    if (this.players.length == 8) {
      this.presentToastMaxPlayer();
    } else {
      this.players.push(new bobPlayer(this.players.length, ""));
    }
  }

  removePlayer(id: number) {
    if (this.players.length == 1) {
      this.presentToastMinPlayer();
    } else {
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].id == id) {
          this.players.splice(i, 1);
          this.players = this.service.setPlayerIDs(this.players);
          return;
        }
      }
    }
  }

  async presentToastMaxPlayer() {
    this.service.toastPopup('playerToast', 'Maximum eight player');
  }

  async presentToastMinPlayer() {
    this.service.toastPopup('playerToast', 'Minimum one player');
  }
}