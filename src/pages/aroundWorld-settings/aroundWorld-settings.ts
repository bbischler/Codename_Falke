import { atwPlayer } from '../../models/atw/atwPlayer';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, PopoverController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { RulesComponent } from '../../components/rules/rules';

@IonicPage()
@Component({
  selector: 'page-aroundWorld-settings',
  templateUrl: 'aroundWorld-settings.html',
})
export class AroundWorldSettingsPage {
  players: atwPlayer[] = [];
  pageName = 'MODAL';
  reorder: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, private service: ServiceProvider,
    public toastController: ToastController, public popoverCtrl: PopoverController) {

    if (localStorage.getItem("atwPlayer")) {
      let tmpplayers = JSON.parse(localStorage.getItem("atwPlayer"));
      for (let p of tmpplayers) {
        this.players.push(new atwPlayer(p.id, p.name));
      }
      this.players = this.service.setPlayerIDs(this.players);
    }
    else {
      this.players.push(new atwPlayer(0, ""));
      this.players.push(new atwPlayer(1, ""));
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
    localStorage.removeItem("atwPlayer");
    this.players = [];
    this.players.push(new atwPlayer(0, ""));
    this.players.push(new atwPlayer(1, ""));
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
    localStorage.setItem("atwPlayer", JSON.stringify(this.players));
    this.viewCtrl.dismiss(true);
  }

  ionViewDidLoad() {
  }

  addPlayer() {
    if (this.players.length == 8) {
      this.presentToastMaxPlayer();
    } else {
      this.players.push(new atwPlayer(this.players.length, ""));
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