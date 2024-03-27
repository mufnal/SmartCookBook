export class Ingredient {
  public name: string;
  public amountOf: number;
  public unit: number;
  public isMandatory: boolean;

  constructor(name: string, amountOf: number, unit: number, isMandatory: boolean) {
    this.name = name;
    this.amountOf = amountOf;
    this.unit = unit;
    this.isMandatory = isMandatory;
  }
}

export enum Unit {
  g = 0,
  kg = 1,
  'szt.' = 2,
  ml = 3,
  l = 4,
  pusz = 5,
  '' = 6,
}
