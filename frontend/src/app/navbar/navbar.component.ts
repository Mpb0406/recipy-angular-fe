import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IsAuthenticatedService } from '../is-authenticated.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
    private isAuthenticated: IsAuthenticatedService
  ) {}

  isAuth = true;

  ngOnInit(): void {
    this.isAuthenticated.isAuth.subscribe((res) => (this.isAuth = res));
    if (localStorage.getItem('user')) {
      this.isAuthenticated.Authenticate();
    } else {
      this.isAuthenticated.logOut();
    }
  }

  logOut() {
    localStorage.removeItem('user');
    this.isAuthenticated.logOut();
    this.router.navigate(['/login']);
  }
}
