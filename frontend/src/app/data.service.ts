import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  api_base_url = 'https://recipy-backend.herokuapp.com';

  logUser(data: object) {
    return this.http.post(
      `${this.api_base_url}/api/auth`,
      JSON.stringify(data),
      this.options
    );
  }

  registerUser(data: object) {
    return this.http.post(
      'http://localhost:5000/api/users',
      JSON.stringify(data),
      this.options
    );
  }

  addRecipe(formData: object, token: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      'http://localhost:5000/api/recipes',
      JSON.stringify(formData),
      options
    );
  }

  getRecipes(token: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http.get(
      'http://localhost:5000/api/recipes/myrecipes',
      options
    );
  }

  deleteRecipe(token: string, recipeId: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http.delete(
      `http://localhost:5000/api/recipes/${recipeId}`,
      options
    );
  }
}
