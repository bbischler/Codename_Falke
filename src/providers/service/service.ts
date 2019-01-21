// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {
  activePage: string = 'Home';

  constructor() {
    console.log('Hello ServiceProvider Provider');
  }
  getActivePage() {
    return this.activePage;
  }
  setActivePage(page) {
    this.activePage = page;
  }

}
