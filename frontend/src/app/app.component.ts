import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private dataService: DataService) {}
  title = 'frontend';

  user = {
    email: 'mpb0406@gmail.com',
    password: '123456',
  };

  login(user: object) {
    this.dataService.logUser(user).subscribe((res) => {
      console.log(res);
    });
  }
}
