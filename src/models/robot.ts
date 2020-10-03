import {FieldDiskEnum} from "../enums/field-disk.enum";
import {Board} from "./board";
import {Player} from "./player";

export class Robot extends Player {
  private myDiscs: number[][] = [];

  constructor(
    private board: Board,
  ) {
      super('Bot',  FieldDiskEnum.WHITE);
      this.myDiscs.push([4,4], [3,3])
  }

  makeDecision() {
    const possibleMoves : number[][] = this.getPossibleMoves()
    const moveNumber = Math.floor(Math.random() * Math.floor(possibleMoves.length))
    return possibleMoves[moveNumber];
  };

  getPossibleMoves() {
    let possibleMoves: number[][] = [];
    this.myDiscs.forEach((item) => {
      const nearbyBlack = this.getNearbyBlack(item);
      nearbyBlack.forEach((itemBlack) => {
        let a = itemBlack[0] - item[0];
        let b = itemBlack[1] - item[1];
        while ( this.board.field[itemBlack[0] - a][itemBlack[1] - b] !== FieldDiskEnum.WHITE ||
        itemBlack[0] - a >= -1 ||
        itemBlack[1] - b >= -1 ||
        itemBlack[0] - a <= this.board.field.length ||
        itemBlack[0] - b <= this.board.field.length ) {
          if (!this.board.field[itemBlack[0] - a][itemBlack[1] - b]) {
            possibleMoves.push([itemBlack[0] - a, itemBlack[1] - b])
          }
          itemBlack[0] -= a;
          itemBlack[1] -= b;
        }
      })
    });
    return possibleMoves;
  }

  getNearbyBlack([x, y]: number[]) {
    let result = [];
    for(let i = -1; i < 2; i++) {
      for(let j = -1; j < 2; j++) {
        if(this.board.field[x + i][y + j] === FieldDiskEnum.BLACK) {
          result.push([x + i, y + j]);
        }
      }
    }
    return result;
  }
}
