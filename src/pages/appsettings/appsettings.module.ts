import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppsettingsPage } from './appsettings';

@NgModule({
  declarations: [
    AppsettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(AppsettingsPage),
  ],
})
export class AppsettingsPageModule {}
