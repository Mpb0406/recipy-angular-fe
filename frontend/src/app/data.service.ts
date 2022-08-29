import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  logUser(data: object) {
    return this.http.post(
      'http://localhost:5000/api/auth',
      JSON.stringify(data),
      this.options
    );
  }
}
