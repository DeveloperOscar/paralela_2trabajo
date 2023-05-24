import { Component } from '@angular/core';
import { NotifierService, status } from 'src/app/services/notifier.service';


// componente encargado de las notificaciones para cada accion CRUD
@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent {

  constructor(public notifierService: NotifierService) { }

  close() {
    this.notifierService.clear();
  }

  getClassesByStatus(status: status): string {
    switch (status) {
      case 'success':
        return 'bg-green-200 text-white';
      case 'error':
        return 'bg-red-200 text-white';
      case 'warning':
        return 'bg-yellow-200 text-black';
      default:
        return '';
    }
  }
}
