import {FieldDiskEnum} from "../enums/field-disk.enum";

export class Player {
  protected score: number = 2;

  constructor(
    private name: string,
    private discColor: FieldDiskEnum,
  ) {}

  getName() {
    return this.name;
  }

  getDiscColor() {
    return this.discColor;
  }

  getScore() {
    return this.score
  }

  setScore(score: number) {
    this.score = score;
  }

  makeDecision(possibleMoves: number[][]): number[] {
    return []
  }
}
