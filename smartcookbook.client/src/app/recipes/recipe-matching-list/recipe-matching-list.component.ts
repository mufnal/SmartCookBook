import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-recipe-matching-list',
  templateUrl: './recipe-matching-list.component.html',
  styleUrls: ['./recipe-matching-list.component.css']
})
export class RecipeMatchingListComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  ingredientCtrl = new FormControl('');
  filteredIngredients: Observable<string[]>;
  ingredients: string[] = [];
  allIngredients: string[] = [];
  matchingRecipes: Recipe[] = [];
  percentageValue: number = 0;

  @ViewChild('ingredientInput') ingredientInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute) {
    this.filteredIngredients = this.ingredientCtrl.valueChanges.pipe(
      startWith(null),
      map((ingredient: string | null) => (ingredient ? this._filter(ingredient) : this.allIngredients.slice())),
    );
  }

  formatLabel(value: number): string {
    if (value >= 1) {
      return Math.round(value / 1).toString();
    }
    return `${value}`;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.ingredients.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.ingredientCtrl.setValue(null);
  }

  remove(ingredient: string): void {
    const index = this.ingredients.indexOf(ingredient);

    if (index >= 0) {
      this.ingredients.splice(index, 1);

      this.announcer.announce(`Removed ${ingredient}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.ingredients.push(event.option.viewValue);
    this.ingredientInput.nativeElement.value = '';
    this.ingredientCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allIngredients.filter(ingredient => ingredient.toLowerCase().includes(filterValue));
  }

  ngOnInit() {
    this.recipeService.recipeMatchingListUpdate
      .subscribe(
        (matchingRecipes: Recipe[]) => {
          this.matchingRecipes = matchingRecipes;
        }
      );
    this.recipeService.recipeListUpdate
      .subscribe(
        (recipes: Recipe[]) => {
          this.matchingRecipes = recipes;
        }
      );
    this.recipeService.mandatoryIngredientsUpdate
      .subscribe(
        (ingredients: string[]) => {
          this.allIngredients = ingredients;
        }
      )
    this.allIngredients = this.recipeService.getMandatoryIngredients();
    this.matchingRecipes = this.recipeService.getRecipes();
  }

  onPercentageChange(event: Event): void {
    const newPercentageValue = (event.target as HTMLInputElement).valueAsNumber;
    this.percentageValue = newPercentageValue;
    //this.recipeService.getMatchingRecipes(this.ingredients, this.percentageValue)
  }

  onFilterRecipes() {
    this.recipeService.getMatchingRecipes(this.ingredients, this.percentageValue)
  }
}
