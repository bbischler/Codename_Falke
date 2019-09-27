import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
// import { ChallengePage } from '../pages/challenge/challenge';
// import { HomePage } from '../pages/home/home';
// import { CricketPage } from '../pages/cricket/cricket';
// import { AppsettingsPage } from '../pages/appsettings/appsettings';
// import { X01Page } from '../pages/x01/x01';
// import { InstructionsPage } from '../pages/instructions/instructions';
// import { CricketSettingsPage } from '../pages/cricket-settings/cricket-settings';
// import { X01SettingsPage } from '../pages/x01-settings/x01-settings';
// import { CricketSettingsPageModule } from '../pages/cricket-settings/cricket-settings.module';
// import { X01SettingsPageModule } from '../pages/x01-settings/x01-settings.module';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ServiceProvider } from '../providers/service/service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
// import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { DataProvider } from '../providers/data/data';


@NgModule({
  declarations: [
    MyApp,
    // HomePage,
    // CricketPage,
    // ChallengePage,
    // X01Page,
    // InstructionsPage,
    // AppsettingsPage,
    // CricketSettingsPage,
    // X01SettingsPage,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    // CricketSettingsPageModule,
    // X01SettingsPageModule,
    // IonicStorageModule.forRoot(),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // HomePage,
    // ChallengePage,
    // CricketPage,
    // X01Page,
    // InstructionsPage,
    // AppsettingsPage,
    // CricketSettingsPage,
    // X01SettingsPage,
  ],
  providers: [
    Vibration,
    NativeAudio,
    StatusBar,
    SplashScreen,
    AdMobFree,
    SocialSharing,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ServiceProvider,
    DataProvider,
  ]
})
export class AppModule { }
