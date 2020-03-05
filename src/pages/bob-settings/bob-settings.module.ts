import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BobSettingsPage } from './bob-settings';

@NgModule({
  declarations: [
    BobSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(BobSettingsPage),
  ],
})
export class BobSettingsPageModule { }
