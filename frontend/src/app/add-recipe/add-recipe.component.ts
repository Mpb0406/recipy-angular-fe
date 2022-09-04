import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css'],
})
export class AddRecipeComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  recipeForm = this.fb.group({
    title: [''],
    description: [''],
    serves: [''],
    preptime: [''],
    cooktime: [''],
    ingredients: this.fb.array([
      this.fb.group({
        amount: this.fb.control(''),
        unit: this.fb.control(''),
        item: this.fb.control(''),
      }),
    ]),
    procedures: this.fb.array([
      this.fb.group({
        step: this.fb.control(''),
      }),
    ]),
  });

  addIngredient() {
    this.recipeForm.controls.ingredients.push(
      this.fb.group({
        amount: this.fb.control(''),
        unit: this.fb.control(''),
        item: this.fb.control(''),
      })
    );
  }

  removeIngredient(index: number) {
    this.recipeForm.controls.ingredients.removeAt(index);
  }

  addStep() {
    this.recipeForm.controls.procedures.push(
      this.fb.group({
        step: this.fb.control(''),
      })
    );
  }

  removeStep(index: number) {
    this.recipeForm.controls.procedures.removeAt(index);
  }

  ngOnInit(): void {}
}
