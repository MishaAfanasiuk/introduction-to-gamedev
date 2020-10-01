import {FieldDiskEnum} from "../enums/field-disk.enum";
import {Board} from "./board";

export class Robot {
  private score: number = 0;
  private myDiscs: number[][] = [];
  private discColor: FieldDiskEnum = FieldDiskEnum.WHITE;

  constructor(
    private name: string,
    private board: Board,

  ) {
      this.myDiscs.push([4,4], [3,3])
  }

  makeMove() {
    // return this.name;
  }

  makeDecision() {
    // return this.name;
  };

  getPossibleMoves() {
    let possibleMoves = [];
    this.myDiscs.forEach((item) => {
      const nearbyBlack = this.getNearbyBlack(item);
      nearbyBlack.forEach((itemBlack) => {
        let a = itemBlack[0] - item[0];
        let b = itemBlack[1] - item[1];
        if(this.board.field[itemBlack[0] - a][itemBlack[1] - b] === FieldDiskEnum.WHITE){
          return
        } else if (!this.board.field[itemBlack[0] - a][itemBlack[1] - b]) {
          possibleMoves.push([itemBlack[0] - a, itemBlack[1] - b])
        }
      })
    })
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
