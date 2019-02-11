import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { X01SettingsPage } from './x01-settings';

@NgModule({
  declarations: [
    X01SettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(X01SettingsPage),
  ],
})
export class X01SettingsPageModule {}
