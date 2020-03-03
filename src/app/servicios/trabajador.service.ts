import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {

  headers = { headers: new HttpHeaders({ 'Content-Type': 'aplication/json', 'Authorization': 'token' }) };
  constructor(private http: HttpClient) { }
  // getJson(url): Observable<any> {
  //   return this.http.get<any>();
  //  }
}
