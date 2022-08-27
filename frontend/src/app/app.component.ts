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

  logUser() {
    this.dataService.logUser().subscribe((res) => {
      console.log(res);
    });
  }
}
