import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {
  notification: string = ""
  constructor() { }

  show(notification: string) {
    this.notification = notification;
  }

  clear(){
    this.notification = "";
  }
}
