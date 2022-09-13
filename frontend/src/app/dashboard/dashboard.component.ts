import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private dataService: DataService) {}

  recipes: any = [];

  ngOnInit(): void {
    const token = JSON.parse(localStorage.getItem('user')!);
    this.dataService.getRecipes(token.token).subscribe((res) => {
      console.log(res);
      this.recipes = res;
    });
  }
}
