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
    this.isAuthenticated.isAuth.subscribe((message) => (this.isAuth = message));
  }

  logOut() {
    localStorage.removeItem('user');
    this.isAuthenticated.Authenticate();
    this.router.navigate(['/login']);
  }
}
