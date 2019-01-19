import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Player } from '../../models/player';
import { ThrowStmt } from '@angular/compiler';

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
    this.slides.slidesPerView = 1.3;
    this.slides.centeredSlides = true;
    this.slides.effect = "slide";
  }
  num: any;
  players: Player[] = [];
  numbers: number[] = [1, 6, 11, 16];
  isDouble: Boolean = false;
  isTriple: Boolean = false;
  throwCounter: number = 0;
  playerCounter: number = 0;
  containerof3: number[] = [1, 2, 3];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if (this.navParams.get('param')) {
      this.num = this.navParams.get('param');
    } else {
      this.num = 301;
    }


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CricketPage');
    this.players.push(new Player(0, "Basti", this.num));
    this.players.push(new Player(1, "Marco", this.num));
    this.players.push(new Player(2, "Tim", this.num));
    this.players.push(new Player(3, "Patrick", this.num));

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
    this.slides.slideTo(this.playerCounter, 1000);
    this.players[this.playerCounter].setScore(0 - points);
    this.players[this.playerCounter].setLastScore(points);

    this.isDouble = false;
    this.isTriple = false;
    this.throwCounter++;

    if (this.throwCounter == 3) {
      this.playerCounter++;
      this.throwCounter = 0;
      if (this.playerCounter == this.players.length) {
        this.playerCounter = 0;
      }
      this.players[this.playerCounter].removeLastThreePoints();
      this.slides.slideTo(this.playerCounter, 1000);
    }
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
  isActive(numberid) {
    if (numberid == this.playerCounter) {
      return true;
    } else {
      return false;
    }
  }


}
