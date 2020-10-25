import {ColorsEnum} from "../enums/colors.enum";
import {Position} from "./position";

export class Player {
  protected score: number = 2;

  constructor(
    private name: string,
    private discColor: ColorsEnum,
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

  makeDecision(possibleMoves: Position[]): Position {
    return
  }
}
