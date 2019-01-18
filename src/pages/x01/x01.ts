import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Player } from '../../models/player';

/**
 * Generated class for the X01Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-x01',
  templateUrl: 'x01.html',
})
export class X01Page {
  @ViewChild(Slides) slides: Slides;
  ngAfterViewInit() {
    this.slides.spaceBetween = 1;
    this.slides.slidesPerView = 1.2;
    this.slides.centeredSlides = true;
    this.slides.effect = "slide";
  }
  num: any;
  players: Player[] = [];
  numbers: number[] = [1, 6, 11, 16];
  isDouble: Boolean = false;
  isTriple: Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if (this.navParams.get('param')) {
      this.num = this.navParams.get('param');
    } else {
      this.num = 301;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CricketPage');
    this.players.push(new Player(0, "basti", this.num));
    this.players.push(new Player(1, "marco", this.num));
    this.players.push(new Player(2, "tim", this.num));
    this.players.push(new Player(3, "patrick", this.num));

  }
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
  }

  addPoints(points: number) {
    if (this.isDouble) {
      points = points * 2;
    }
    if (this.isTriple) {
      points = points * 3;
    }
    console.log(points);
    // this.players[id].setScore(points);
    this.isDouble = false;
    this.isTriple = false;
  }
  undo() { }
  double() {
    this.isTriple = false;
    this.isDouble = !this.isDouble;
  }
  triple() {
    this.isDouble = false;
    this.isTriple = !this.isTriple;
  }


}
