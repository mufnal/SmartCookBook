import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  selectedRecipe!: Recipe;
  recipes: Recipe[] = [];
  matchingRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService, private dataStorageService: DataStorageService) { }

  ngOnInit() {
    this.recipeService.recipeSelected
      .subscribe(
        (recipe: Recipe) => {
          this.selectedRecipe = recipe;
        }
      );
    this.recipeService.recipeCreated
      .subscribe((recipe: Recipe) => {
        this.createRecipe(recipe);
        console.log('recipes updated:', this.recipes);
      })
    this.recipeService.recipeUpdated
      .subscribe((recipe: Recipe) => {
        this.updateRecipe(recipe);
        console.log('recipes updated:', this.recipes);
      });
    this.recipeService.recipeDeleted
      .subscribe((recipe: Recipe) => {
        this.deleteRecipe(recipe);
        console.log('recipes updated:', this.recipes);
      })
    this.recipeService.recipeMatchingRequest
      .subscribe((request: { ingredients: string[], percentage: number }) => {
        this.fetchMatchingRecipes(request.ingredients, request.percentage)
      });
    this.fetchRecipes();
    this.fetchIngredients();
    this.fetchMandatoryIngredients()
  }

  createRecipe(recipe: Recipe): void {
    const recipeToCreate = recipe;
    this.dataStorageService.postRecipe(recipeToCreate).subscribe(
      (response) => {
        console.log('Recipe saved successfully:', response);
        // Handle success, if needed
      },
      (error) => {
        console.error('Error saving recipe:', error);
        // Handle error, if needed
      }
    );
  }

  updateRecipe(recipe: Recipe): void {
    const recipeToUpdate = recipe;
    this.dataStorageService.updateRecipe(recipeToUpdate).subscribe(
      (response) => {
        console.log('Recipe updated successfully:', response);
        // Handle success, if needed
      },
      (error) => {
        console.error('Error updating recipe:', error);
        // Handle error, if needed
      }
    );
  }

  fetchRecipes(): void {
    this.dataStorageService.fetchRecipes()
      .subscribe((recipes: Recipe[]) => {
        this.recipeService.setRecipes(recipes);
      });
  }

  fetchMatchingRecipes(ingredients: string[], percentage: number): void {
    this.dataStorageService.fetchMatchingRecipes(ingredients, percentage)
      .subscribe((matchingRecipes: Recipe[]) => {
        this.recipeService.setMatchingRecipes(matchingRecipes);
      });
  }

  fetchMandatoryIngredients(): void {
    this.dataStorageService.fetchMandatoryIngredients()
      .subscribe((ingredients: string[]) => {
        this.recipeService.setMandatoryIngredients(ingredients);
      });
  }

  fetchIngredients(): void {
    this.dataStorageService.fetchIngredients()
      .subscribe((ingredients: string[]) => {
        this.recipeService.setIngredients(ingredients);
      });
  }

  deleteRecipe(recipe: Recipe): void {
    this.dataStorageService.deleteRecipe(recipe.id).subscribe(
      (response) => {
        console.log('Recipe deleted successfully:', response);
        // Handle success, if needed
      },
      (error) => {
        console.error('Error deleting recipe:', error);
        // Handle error, if needed
      }
    );
  }
}
