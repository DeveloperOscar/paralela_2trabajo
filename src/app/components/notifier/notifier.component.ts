import { Component } from '@angular/core';
import { NotifierService } from 'src/app/services/notifier.service';


// componente encargado de las notificaciones para cada accion CRUD
@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent {

  constructor(public notifierService: NotifierService){}

  close(){
    this.notifierService.clear();
  }

}
