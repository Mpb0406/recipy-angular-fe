import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css'],
})
export class AddRecipeComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {}

  recipeForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    serves: [''],
    preptime: [''],
    cooktime: [''],
    ingredients: this.fb.array([
      this.fb.group({
        amount: this.fb.control('', Validators.required),
        unit: this.fb.control('', Validators.required),
        item: this.fb.control('', Validators.required),
      }),
    ]),
    procedures: this.fb.array([
      this.fb.group({
        step: this.fb.control('', Validators.required),
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

  submitRecipe() {
    console.log(this.recipeForm.value);

    const token = JSON.parse(localStorage.getItem('user')!);
    this.dataService
      .addRecipe(this.recipeForm.value, token.token)
      .subscribe((res) => {
        console.log(res);
        this.router.navigate(['/dashboard']);
      });
  }

  ngOnInit(): void {}
}
