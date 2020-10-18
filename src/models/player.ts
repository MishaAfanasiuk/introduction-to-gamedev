import {FieldDiskEnum} from "../enums/field-disk.enum";

export class Player {
  protected score: number = 2;
  protected status: string = 'playing';

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

  makeDecision(move: number[]): number[] {
    return []
  }
}
