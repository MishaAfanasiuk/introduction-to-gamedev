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

  // getPossibleMoves() {
  //   let possibleMoves: number[][] = [];
  //   let myDiscs = this.getMyDiscs();
  //   myDiscs.forEach((item) => {
  //     const nearbyBlack = this.getNearbyEnemy(item);
  //     nearbyBlack.forEach((itemBlack) => {
  //       let a = itemBlack[0] - item[0];
  //       let b = itemBlack[1] - item[1];
  //       let x = itemBlack[0];
  //       let y = itemBlack[1];
  //
  //       while ( this.board.field[x][y] !== this.getDiscColor() &&
  //       x > -1 &&
  //       y > -1 &&
  //       x < this.board.field.length &&
  //       y < this.board.field.length ) {
  //         x = x + a;
  //         y = y + b;
  //         console.log(x);
  //         console.log(y);
  //         if (this.board.field[x][y] !== this.getEnemy(this.getDiscColor())) {
  //           possibleMoves.push([x, y]);
  //           return
  //         }
  //       }
  //     })
  //   });
  //   return possibleMoves;
  // }
  //
  // getMyDiscs() {
  //   let result: number[][] = [];
  //   this.board.field.forEach((item, row) => {
  //     item.forEach((item, column) => {
  //       if(item === this.getDiscColor()) {
  //         result.push([row, column]);
  //       }
  //     })
  //   });
  //   return result;
  // }
  //
  // getEnemy(disc: FieldDiskEnum) {
  //   return disc === FieldDiskEnum.WHITE ? FieldDiskEnum.BLACK : FieldDiskEnum.WHITE
  // }
  //
  // getNearbyEnemy([x, y]: number[]) {
  //   let result = [];
  //   for(let i = -1; i < 2; i++) {
  //     for(let j = -1; j < 2; j++) {
  //       if(this.board.field[x + i][y + j] === this.getEnemy(this.getDiscColor())) {
  //         result.push([x + i, y + j]);
  //       }
  //     }
  //   }
  //   return result;
  // }
}
