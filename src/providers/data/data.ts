import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  checkoutTableDoubleOut = new Map();
  checkoutTableSingleOut = new Map();

  constructor(public http: HttpClient) {
    this.setCheckoutTables();
  }

  setCheckoutTables() {
    this.http.get('../../assets/checkoutTableDoubleOut.csv', { responseType: 'text' })
      .subscribe(
        data => {
          data = data.replace(/(\r\n|\n|\r)/gm, "Y");
          var lines = data.split('Y');
          for (let line of lines) {
            var arr = line.split(';');
            let score = parseInt(arr[0]);
            let tmpArr: String[] = [];
            let _toThrow = arr[1].split(' ');
            for (let i of _toThrow) {
              tmpArr.push(i);
            }
            this.checkoutTableDoubleOut.set(score, tmpArr);
          }

        },
        error => {
          console.log(error);
        }
      );

    this.http.get('../../assets/checkoutTableSingleOut.csv', { responseType: 'text' })
      .subscribe(
        data => {
          data = data.replace(/(\r\n|\n|\r)/gm, "Y");
          var lines = data.split('Y');
          for (let line of lines) {
            var arr = line.split(';');
            let score = parseInt(arr[0]);
            let tmpArr: String[] = [];
            let _toThrow = arr[1].split(' ');
            for (let i of _toThrow) {
              tmpArr.push(i);
            }
            this.checkoutTableSingleOut.set(score, tmpArr);
          }

        },
        error => {
          console.log(error);
        }
      );

  }

  getCheckOut(num) {

    let isdoubleOut: boolean = JSON.parse(localStorage.getItem("doubleOutGame"));
    if (isdoubleOut) {
      if (this.checkoutTableDoubleOut.get(num)) {
        return this.checkoutTableDoubleOut.get(num);
      }
    } else {
      if (this.checkoutTableSingleOut.get(num)) {
        return this.checkoutTableSingleOut.get(num);
      }
    }
  }
}
