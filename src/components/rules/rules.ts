import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
/**
 * Generated class for the Quickstatsx01Component component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rules',
  templateUrl: 'rules.html'
})
export class RulesComponent {

  mode: string = "";

  constructor(public navParams: NavParams) {
    this.mode = this.navParams.get('key1');
  }

  isMode(mode: string) {
    return mode == this.mode;
  }
}
