import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegistrarService {

  headers = { headers: new HttpHeaders({ 'Content-Type': 'aplication/json', 'Authorization': 'token' }) };
  constructor(private http: HttpClient) { }

  // getJson(url): Observable<any> {
  //   return this.http.get<any>();
  // }

  // postJson(Data: any, url): Observable<any> {
  //   return this.http.post<any>(, Data);
  // }
  // putJson(Data: any, url): Observable<any> {
  //   return this.http.patch<any>(, Data);
  // }

}
