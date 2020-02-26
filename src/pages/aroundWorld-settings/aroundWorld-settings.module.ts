import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AroundWorldSettingsPage } from './aroundWorld-settings';

@NgModule({
  declarations: [
    AroundWorldSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(AroundWorldSettingsPage),
  ],
})
export class AroundWorldSettingsPageModule {}
