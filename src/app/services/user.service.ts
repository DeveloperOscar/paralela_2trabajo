import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


// realizar aqui la comunicacion http con el servidor

// url para obtener los recursos: "aun no habido" (backend en creación)

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = "";

  constructor(private http: HttpClient) { }

  getUsers(){

  }

  addUser(){

  }

  removeUser(){

  }

}
