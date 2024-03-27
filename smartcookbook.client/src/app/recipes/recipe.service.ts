import { EventEmitter, Injectable } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from "./recipe.model";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();
  recipeCreated = new EventEmitter<Recipe>();
  recipeUpdated = new EventEmitter<Recipe>();
  recipeDeleted = new EventEmitter<Recipe>();
  recipeListUpdate = new EventEmitter<Recipe[]>();
  recipeMatchingListUpdate = new EventEmitter<Recipe[]>();
  ingredientsUpdate = new EventEmitter<string[]>();
  mandatoryIngredientsUpdate = new EventEmitter<string[]>();
  recipeMatchingRequest = new EventEmitter<{ ingredients: string[], percentage: number }>();

  private recipes: Recipe[] = [];
  private matchingRecipes: Recipe[] = [];
  private mandatoryIngredients: string[] = [];
  private ingredients: string[] = [];

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeListUpdate.emit(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  setMatchingRecipes(matchingRecipes: Recipe[]) {
    this.matchingRecipes = matchingRecipes;
    this.recipeMatchingListUpdate.emit(this.matchingRecipes.slice());
  }

  getMatchingRecipes(ingredients: string[], percentage: number) {
    this.recipeMatchingRequest.emit({ ingredients, percentage })
    return this.matchingRecipes.slice();
  }

  setMandatoryIngredients(mandatoryIngredients: string[]) {
    this.mandatoryIngredients = mandatoryIngredients
    this.mandatoryIngredientsUpdate.emit(this.mandatoryIngredients.slice())
  }

  getMandatoryIngredients() {
    return this.mandatoryIngredients.slice();
  }

  setIngredients(ingredients: string[]) {
    this.ingredients = ingredients
    this.ingredientsUpdate.emit(this.ingredients.slice())
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    for (const step of recipe.steps) {
      step.index = recipe.steps.indexOf(step)
    }
    this.recipes.push(recipe);
    this.recipeCreated.emit(recipe)
    this.recipeListUpdate.emit(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    newRecipe.id = this.recipes[index].id
    this.recipes[index] = newRecipe;
    this.recipeUpdated.emit(this.recipes[index]);
    this.recipeListUpdate.emit(this.recipes.slice());
  }

  deleteRecipe(id: number) {
    const recipeToDelete = this.recipes.find((rec) => rec.id == id);
    if (recipeToDelete) {
      this.recipeDeleted.emit(recipeToDelete);
      const deletedRecipeIndex = this.recipes.indexOf(recipeToDelete);
      this.recipes.splice(deletedRecipeIndex, 1);
      this.recipeListUpdate.emit(this.recipes.slice())
    }
  }

  constructor(private dataStorageService: DataStorageService) { }
}
