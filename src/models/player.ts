import {ColorsEnum} from "../enums/colors.enum";
import {Position} from "./position";
import {PlayerIndexType} from "../types/playerIndexType";

export class Player {
  protected score: number = 2;

  constructor(
    private name: string,
    private discColor: ColorsEnum,
    private index: PlayerIndexType,
  ) {}

  copy(): Player {
    const newPlayer = new Player(
      this.name,
      this.discColor,
      this.index
    );

    newPlayer.setScore(this.score);
    return newPlayer
  }

  getName() {
    return this.name;
  }

  getIndex(): PlayerIndexType {
    return this.index;
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
