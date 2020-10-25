import {ColorsEnum} from "../enums/colors.enum";
import {Player} from "./player";
import {Position} from "./position";

export class Robot extends Player {

  constructor(
    diskColor: ColorsEnum,
  ) {
    super('Bot',  diskColor);
  }

  makeDecision(possibleMoves: Position[]): Position {
    const moveNumber = Math.floor(Math.random() * Math.floor(possibleMoves.length));
    return possibleMoves[moveNumber];
  };
}
