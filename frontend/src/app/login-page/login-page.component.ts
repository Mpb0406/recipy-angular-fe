import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { IsAuthenticatedService } from '../is-authenticated.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private router: Router,
    private isAuthenticated: IsAuthenticatedService
  ) {}

  isAuth = true;

  ngOnInit(): void {
    this.isAuthenticated.isAuth.subscribe((message) => (this.isAuth = message));
  }

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  login(loginForm: any) {
    this.dataService.logUser(loginForm.value).subscribe((res) => {
      console.log(res);
      localStorage.setItem('user', JSON.stringify(res));
      this.router.navigate(['/dashboard']);
      this.isAuthenticated.logOut();
    });
  }
}
