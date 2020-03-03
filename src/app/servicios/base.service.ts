import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import{EndpoindService} from '../endpoind.service';
@Injectable({
  providedIn: 'root'
})
export class BaseService {

  headers = { headers: new HttpHeaders({ 'Content-Type': 'aplication/json'}) };
  constructor(private http: HttpClient, public urlCentral:EndpoindService) { }
  
  getJson(url):Observable<any>{
    return this.http.get<any>(this.urlCentral.getEndpoindGov()+url);
  }

  postJson(Data:any,url):Observable<any>{
    return this.http.post<any>(this.urlCentral.getEndpoindGov()+url,Data);
  }

  putJson(Data:any,url):Observable<any>{
    return this.http.patch<any>(this.urlCentral.getEndpoindGov()+url,Data);
  }

}
