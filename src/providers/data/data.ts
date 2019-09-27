import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  checkoutTable = new Map();

  constructor(public http: HttpClient) {
    this.getCheckoutTable();
  }
  getCheckoutTable() {
    this.http.get('../../assets/checkoutTable.csv', { responseType: 'text' })
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
            this.setCheckOutTable(score, tmpArr);
          }

        },
        error => {
          console.log(error);
        }
      );

  }

  setCheckOutTable(key: number, value: String[]) {
    this.checkoutTable.set(key, value);
  }


  getCheckOut(num) {
    if (this.checkoutTable.get(num)) {
      return this.checkoutTable.get(num);
    }
  }
}
