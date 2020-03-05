import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BobPage } from './bob';

@NgModule({
  declarations: [
    BobPage,
  ],
  imports: [
    IonicPageModule.forChild(BobPage),
  ],
})
export class BobPageModule { }
