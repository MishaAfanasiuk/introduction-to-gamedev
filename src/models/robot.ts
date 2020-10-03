import {FieldDiskEnum} from "../enums/field-disk.enum";
import {Board} from "./board";
import {Player} from "./player";

export class Robot extends Player {

  constructor(
    private board: Board,
  ) {
    super('Bot',  FieldDiskEnum.WHITE);
  }

  makeDecision(possibleMoves: number[][]) {
    const moveNumber = Math.floor(Math.random() * Math.floor(possibleMoves.length));
    return possibleMoves[moveNumber];
  };
}
