import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IsAuthenticatedService {
  private Authenticated = new BehaviorSubject<boolean>(false);
  isAuth = this.Authenticated.asObservable();

  constructor() {}

  Authenticate() {
    this.Authenticated.next(true);
  }

  logOut() {
    this.Authenticated.next(false);
  }
}
