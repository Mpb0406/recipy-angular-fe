import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css'],
})
export class AddRecipeComponent implements OnInit {
  constructor() {}

  recipeForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    yield: new FormControl(''),
    prep: new FormControl(''),
    cook: new FormControl(''),
    amount: new FormControl(''),
    unit: new FormControl(''),
    ingredient: new FormControl(''),
    step: new FormControl(''),
  });

  ngOnInit(): void {}
}
