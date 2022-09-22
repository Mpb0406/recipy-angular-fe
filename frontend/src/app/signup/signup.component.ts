import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { IsAuthenticatedService } from '../is-authenticated.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private router: Router,
    private isAuthenticated: IsAuthenticatedService
  ) {}

  ngOnInit(): void {}

  signupForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  register(signupForm: object) {
    this.dataService.registerUser(signupForm).subscribe((res) => {
      console.log(res);
      localStorage.setItem('user', JSON.stringify(res));
      this.router.navigate(['/dashboard']);
      this.isAuthenticated.Authenticate();
    });
  }
}
