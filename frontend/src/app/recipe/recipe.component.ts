import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
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

  removeRecipe() {
    const token = JSON.parse(localStorage.getItem('user')!);
    const recipeId = this.route.snapshot.paramMap.get('recipe');
    this.dataService.deleteRecipe(token.token, recipeId!).subscribe((res) => {
      this.router.navigate(['/dashboard']);
    });
  }
}
