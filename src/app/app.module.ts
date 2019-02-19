import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ChallengePage } from '../pages/challenge/challenge';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { CricketPage } from '../pages/cricket/cricket';
import { X01Page } from '../pages/x01/x01';
import { InstructionsPage } from '../pages/instructions/instructions';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ServiceProvider } from '../providers/service/service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    CricketPage,
    ChallengePage,
    X01Page,
    InstructionsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChallengePage,
    CricketPage,
    ListPage,
    X01Page,
    InstructionsPage
  ],
  providers: [
    NativeAudio,
    StatusBar,
    SplashScreen,
    AdMobFree,
    SocialSharing,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ServiceProvider,
  ]
})
export class AppModule { }
