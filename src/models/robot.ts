import {ColorsEnum} from "../enums/colors.enum";
import {Player} from "./player";
import {Position} from "./position";
import {PlayerIndexType} from "../types/playerIndexType";

export class Robot extends Player {

  constructor(
    diskColor: ColorsEnum,
    index: PlayerIndexType,
  ) {
    super('Bot',  diskColor, index);
  }

  makeDecision(possibleMoves: Position[]): Position {
    const moveNumber = Math.floor(Math.random() * Math.floor(possibleMoves.length));
    return possibleMoves[moveNumber];
  };
}
