import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {}

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  login(loginForm: any) {
    this.dataService.logUser(loginForm.value).subscribe((res) => {
      console.log(res);
      localStorage.setItem('user', JSON.stringify(res));
      this.router.navigate(['/dashboard']);
    });
  }
}
