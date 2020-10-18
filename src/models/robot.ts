import {FieldDiskEnum} from "../enums/field-disk.enum";
import {Board} from "./board";
import {Player} from "./player";
import {Game} from "./game";

export class Robot extends Player {
  constructor() {
    super('Bot',  FieldDiskEnum.WHITE);
  }
  makeDecision(move: number[]): number[] {
    return move;
  }

  // makeDecision(possibleMoves: number[][]) {
  //   let moveNumber = 0,
  //     bestScore = 0,
  //     boardCopy = new Board();
  //   boardCopy.field = this.board.field.map(x => x.slice());
  //   possibleMoves.forEach((move, index) => {
  //     boardCopy.makeMove(move[0], move[1], this.getDiscColor());
  //     let score = this.minimax(boardCopy, 0, true);
  //     if( score > bestScore ) {
  //       moveNumber = index;
  //       bestScore = score;
  //     }
  //     boardCopy.field = this.board.field.map(x => x.slice());
  //   });
  //
  //   // const moveNumber = Math.floor(Math.random() * Math.floor(possibleMoves.length));
  //   return possibleMoves[moveNumber];
  // };
  //
  // minimax(board : Board, depth : number, robot_turn : boolean){
  //   let bestScore: number;
  //   console.log(robot_turn);
  //   let cycleRepeat = 0;
  //
  //   if ( this.status !== 'playing' ) {
  //     if (this.status === 'winner') {
  //       return  1000
  //     } else {
  //       return -1000
  //     }
  //   }
  //
  //   if(robot_turn) {
  //     if (board.getAvailableMoves(this.getDiscColor()).length > 0) {
  //       let boardCopy = new Board();
  //       bestScore = 0;
  //       boardCopy.field = board.field.map(x => x.slice());
  //       board.getAvailableMoves(this.getDiscColor()).forEach((move) => {
  //         boardCopy.makeMove(move[0], move[1], this.getDiscColor());
  //         let score = this.minimax(boardCopy, depth + 1, false);
  //         if( score > bestScore ) {
  //           bestScore = score;
  //         }
  //         boardCopy.field = board.field.map(x => x.slice());
  //       });
  //     } else {
  //       cycleRepeat += 1
  //     }
  //
  //   } else {
  //     if ( board.getAvailableMoves(this.getOpponentColor()).length > 0 ) {
  //       let boardCopy = new Board();
  //       bestScore = 1000;
  //       boardCopy.field = board.field.map(x => x.slice());
  //       board.getAvailableMoves(this.getOpponentColor()).forEach((move) => {
  //         boardCopy.makeMove(move[0], move[1], this.getOpponentColor());
  //         let score = this.minimax(boardCopy, depth + 1, true);
  //         if( score < bestScore ) {
  //           bestScore = score;
  //         }
  //         boardCopy.field = board.field.map(x => x.slice());
  //       });
  //     } else {
  //       cycleRepeat += 1
  //     }
  //   }
  //
  //   return bestScore;
  // }
}
