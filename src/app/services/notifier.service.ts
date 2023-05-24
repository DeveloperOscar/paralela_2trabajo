import { Injectable } from '@angular/core';

export type status = "success" | "error" | "warning";
interface Notification {
  message: string;
  status: status;
}


@Injectable({
  providedIn: 'root'
})
export class NotifierService {
  messages: Notification[] = []
  constructor() { }

  add(message: string, status: status) {
    this.messages.push({ message, status });
  }

  clear() {
    this.messages = [];
  }
}
