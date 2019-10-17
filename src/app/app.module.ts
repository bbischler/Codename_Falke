import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
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
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,


  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    Vibration,
    NativeAudio,
    StatusBar,
    Insomnia,
    SplashScreen,
    AdMobFree,
    SocialSharing,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ServiceProvider,
    DataProvider,
  ]
})
export class AppModule { }
