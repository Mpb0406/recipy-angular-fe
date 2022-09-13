import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  recipe: any = [];

  ngOnInit(): void {
    const token = JSON.parse(localStorage.getItem('user')!);
    this.dataService.getRecipes(token.token).subscribe((res) => {
      this.recipe = Object.values(res).filter(
        (item: { _id: string | null }) =>
          item._id === this.route.snapshot.paramMap.get('recipe')
      )[0];
    });
  }
}
