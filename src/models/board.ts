import {ColorsEnum} from "../enums/colors.enum";
import {Cell} from "./cell";
import {Position} from "./position";
import {StreakFinder} from "./possibleMovesFinder";

export declare type Field = Cell[][];

export class Board {
  field: Field = [];

  constructor(
    private blackHole: Position,
    fieldSize = 8
  ) {
    for (let x = 0; x < fieldSize; x++) {
      this.field.push([]);
      for (let y = 0; y < fieldSize; y++) {
        this.field[x].push(
          new Cell(new Position(x, y))
        )
      }
    }

    this.field[4][3].color = ColorsEnum.BLACK;
    this.field[3][4].color = ColorsEnum.BLACK;

    this.field[3][3].color = ColorsEnum.WHITE;
    this.field[4][4].color = ColorsEnum.WHITE;
  }

  getBlackHole() {
    return this.blackHole
  }

  getField() {
    return this.field
  }

  getCell({ x, y }: Position) {
    return this.field[x]?.[y]
  }

  getAllCells(): Cell[] {
    return this.field.flat()
  }

  makeMove(position: Position, disc: ColorsEnum): Position | null {
    const { x, y } = position;
    this.field[x][y].color = disc;

    const streaks = new StreakFinder().getStreaksForColor(
      position,
      this,
      disc
    );

    if (!streaks.length) {
      this.field[x][y].removeColor();
      return
    }

    streaks.forEach((streak) => {
      for (let cell of streak) {
        if (cell.color === disc) {
          return
        }

        cell.color = disc;
      }
    });

    return new Position(x, y);
  }
}
