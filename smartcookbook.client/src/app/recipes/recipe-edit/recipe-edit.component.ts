import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Recipe } from '../recipe.model';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id!: number;
  editMode = false;
  recipeForm!: FormGroup;
  selectedUnit: string = '';
  units = [
    {
      key: "g",
      value: 0,
    },
    {
      key: "kg",
      value: 1,
    },
    {
      key: "szt.",
      value: 2,
    },
    {
      key: "ml",
      value: 3,
    },
    {
      key: "l",
      value: 4,
    },
    {
      key: "pusz",
      value: 5,
    },
    {
      key: "N/D",
      value: 5,
    },
  ];

  isImageSaved: boolean = false;
  cardImageBase64: string = '';
  selectedRecipe!: Recipe;

  options: string[] = ["masło", "makaron", "mięso"];
  filteredOptions!: Observable<string[]>;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
    this.recipeService.ingredientsUpdate
      .subscribe(
        (ingredients: string[]) => {
          this.options = ingredients;
        }
      );
    this.options = this.recipeService.getIngredients();
  }

  private initForm() {
    let recipeName = '';
    let recipeDifficulty = 0;
    let recipeTimeInMinutes = 0;
    let recipeNumberOfServings = 0;
    let recipeImagePath = '';
    const recipeIngredients = new FormArray<FormGroup>([]);
    const recipeSteps = new FormArray<FormGroup>([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      this.selectedRecipe = recipe;
      recipeName = recipe.name;
      recipeDifficulty = recipe.difficulty;
      recipeTimeInMinutes = recipe.timeInMinutes;
      recipeNumberOfServings = recipe.numberOfServings;
      recipeImagePath = recipe.imagePath;
      if (recipe['ingredients']) {
        for (const ingredient of recipe.ingredients) {
          const nameControl = new FormControl<string>(ingredient.name, Validators.required)
          nameControl.valueChanges.subscribe(() => {
            this.filteredOptions = nameControl.valueChanges.pipe(
              startWith(''),
              map(value => {
                const name = typeof value === 'string' ? value : value;
                return name ? this._filter(name as string) : this.options.slice();
              }),
            );
          });
          recipeIngredients.push(
            new FormGroup({
              'name': nameControl,
              'amountOf': new FormControl(ingredient.amountOf, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ]),
              'unit': new FormControl<number>(ingredient.unit),
              'isMandatory': new FormControl(ingredient.isMandatory)
            })
          );
        }
      }
      if (recipe['steps']) {
        for (const step of recipe.steps) {
          recipeSteps.push(
            new FormGroup({
              'description': new FormControl(step.description, Validators.required),
              'index': new FormControl(recipeSteps.length)
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'difficulty': new FormControl(recipeDifficulty, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/), Validators.min(1), Validators.max(10)]),
      'timeInMinutes': new FormControl(recipeTimeInMinutes, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/), Validators.min(1), Validators.max(9999)]),
      'numberOfServings': new FormControl(recipeNumberOfServings, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/), Validators.min(1), Validators.max(99)]),
      'imagePath': new FormControl(recipeImagePath),
      'ingredients': recipeIngredients,
      'steps': recipeSteps,
    });
  }

  onAddIngredient() {
    const newIngredientFormGroup = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amountOf': new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ]),
      'unit': new FormControl<number>(0),
      'isMandatory': new FormControl<boolean>(false),
    });

    const nameControl = newIngredientFormGroup.get('name') as FormControl;

    this.filteredOptions = nameControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    nameControl.valueChanges.subscribe(() => {
      this.filteredOptions = nameControl.valueChanges.pipe(
        startWith(''),
        map(val => this._filter(val))
      );
    });

    (<FormArray>this.recipeForm.get('ingredients')).push(newIngredientFormGroup);
  }

  onAddStep() {
    (<FormArray>this.recipeForm.get('steps')).push(
      new FormGroup({
        'description': new FormControl(null, Validators.required),
      })
    );
  }

  get ingredientsControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  get stepsControls() {
    return (<FormArray>this.recipeForm.get('steps')).controls;
  }

  CreateBase64String(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path;
          this.isImageSaved = true;
          console.log(imgBase64Path);
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  onSubmit() {
    if (this.cardImageBase64.length !== 0) {
      this.recipeForm.patchValue({
        imagePath: this.cardImageBase64
      })
    }
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    }
    else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }
  //onSubmit() {
  //  if (this.editMode) {
  //    this.recipeService.updateRecipe(this.id, this.recipeForm.value);
  //  }
  //  else {
  //    this.recipeService.addRecipe(this.recipeForm.value);
  //  }
  //  this.onCancel();
  //}

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onDeleteStep(index: number) {
    (<FormArray>this.recipeForm.get('steps')).removeAt(index);
  }

  selectUnit(event: Event, index: number) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const unitControl = (this.ingredientsControls[index] as FormGroup).get('unit');
    if (unitControl) {
      unitControl.setValue(selectedValue);
    }
    this.selectedUnit = selectedValue;
  }

  private _filter(name: string): string[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
