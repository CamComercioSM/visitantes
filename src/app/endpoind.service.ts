import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndpoindService {

  constructor() { }
  getEndpoindGov():string{
    //let uri = 'http://172.16.19.25:3000';
    //uri = 'http://localhost:3000';
    //let uri='https://desarrollosicam32-net-jpllinas943510.codeanyapp.com/api/';
    let uri='https://api.sicam32.net/';
    //let uri='https://api.sicam32.net.co/';
    return uri;
  }
}
