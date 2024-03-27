import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient) { }

  postRecipe(recipe: Recipe): Observable<object> {
    //recipe.ingredients.forEach((element) => element.unit = parseInt(element.unit,10))
    recipe.ingredients.forEach((element) => element.unit = +element.unit);
    const jsonRecipe = JSON.stringify(recipe);
    return this.http.post(
      'https://localhost:7009/api/recipes/',
      recipe
    );
  }

  updateRecipe(recipe: Recipe): Observable<object> {
    recipe.ingredients.forEach((element) => element.unit = +element.unit);
    return this.http.put(
      'https://localhost:7009/api/recipes/',
      recipe
    );
  }

  deleteRecipe(id: number): Observable<object> {
    return this.http.delete('https://localhost:7009/api/recipes/' + id)
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(
      'https://localhost:7009/api/recipes/'
    );
  }

  fetchMandatoryIngredients(): Observable<string[]> {
    return this.http.get<string[]>(
      'https://localhost:7009/api/Ingredient/GetMandatory'
    );
  }

  fetchIngredients(): Observable<string[]> {
    return this.http.get<string[]>(
      'https://localhost:7009/api/Ingredient/'
    );
  }

  fetchMatchingRecipes(ingredients: string[], percentage: number): Observable<Recipe[]> {
    let queryParams = new HttpParams();
    for (const ingredient of ingredients) {
      queryParams = queryParams.append("ingredients", ingredient)
    }
    queryParams = queryParams.append("percentageMatched", percentage)
    return this.http.get<Recipe[]>(
      'https://localhost:7009/api/recipes/GetMatchingRecipes/', { params: queryParams }
    );
  }
}
