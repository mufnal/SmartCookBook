import { Ingredient } from "../shared/ingredient.model";
import { Step } from "../shared/step.model";

export class Recipe {
  public id: number;
  public name: string;
  public difficulty: number;
  public timeInMinutes: number;
  public numberOfServings: number;
  public imagePath: string;
  public ingredients: Ingredient[];
  public steps: Step[];

  constructor(id: number, name: string, difficulty: number, timeInMinutes: number, numberOfServings: number, imagePath: string, ingredients: Ingredient[], steps: Step[]) {
    this.id = id;
    this.name = name;
    this.difficulty = difficulty;
    this.timeInMinutes = timeInMinutes;
    this.numberOfServings = numberOfServings;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
    this.steps = steps
  }
}
