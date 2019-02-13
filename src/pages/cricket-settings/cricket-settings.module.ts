import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CricketSettingsPage } from './cricket-settings';

@NgModule({
  declarations: [
    CricketSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(CricketSettingsPage),
  ],
})
export class CricketSettingsPageModule {}
