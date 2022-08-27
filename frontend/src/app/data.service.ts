import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}
  body = {
    email: 'mpb0406@gmail.com',
    password: '123456',
  };

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  logUser(data: object) {
    console.log(this.body);
    return this.http.post('http://localhost:5000/api/auth', data, this.options);
  }
}
