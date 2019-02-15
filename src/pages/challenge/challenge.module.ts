import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChallengePage } from './challenge';

@NgModule({
  declarations: [
    ChallengePage,
  ],
  imports: [
    IonicPageModule.forChild(ChallengePage),
  ],
})
export class ChallengePageModule {}
