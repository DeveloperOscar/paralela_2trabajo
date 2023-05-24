import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { ResponseObject } from '../models/response_object';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { PaginationData } from '../models/pagination-data';
import { User } from '../models/user';


// realizar aqui la comunicacion http con el servidor

// url para obtener los recursos: "aun no habido" (backend en creación)

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // url = "https://paralelausersbackend-production.up.railway.app/users";
  url = "http://localhost:8090/users"
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-type': 'application/json' }),
  }

  constructor(private http: HttpClient) { }

  getCountUsers(pageSize: number, currentPage: number): Observable<PaginationData> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('currentPage', currentPage);
    return this.http.get<ResponseObject<PaginationData>>(this.url, {
      headers: this.httpOptions.headers,
      params,
    }).pipe(
      catchError(this.handleError()),
      tap(responseObject => this.log(responseObject.message || "Se obtuvieron lo usuarios correctamente")),
      map(responseObject => responseObject.data),
    );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<ResponseObject<User>>(this.url, user, this.httpOptions).pipe(
      catchError(this.handleError()),
      map(responseObject => responseObject.data as User)
    );
  }

  removeUser(user: User): Observable<Number> {
    const url_delete = `${this.url}/${user.id}`;
    return this.http.delete<ResponseObject<Number>>(url_delete, this.httpOptions).pipe(
      catchError(this.handleError()),
      tap(_ => this.log("Se elimino correctamente el usuario")),
      map(responseObject => responseObject.data as Number),
    );
  }

  private handleError() {
    return (error: HttpErrorResponse) => {
      if (error.status === 0) {
        this.log(`Ocurrio un error del lado del cliente: ${error.error}`);
      } else {
        const responseObject: ResponseObject<any> = error.error as ResponseObject<any>;
        this.log(`Se retorno el codigo ${error.status}, con el siguiente mensaje: , ${responseObject.message}`);
        this.log(`Objeto error del servidor  ${responseObject.error?.toString()}`);
      }
      return throwError(() => new Error('Halgo malo paso, intentelo de nuevo mas tarde'));
    }
  }

  private log(message: string) {
    console.log(message);
  }

}
