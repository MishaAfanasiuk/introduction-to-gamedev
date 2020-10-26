import {ColorsEnum} from "../enums/colors.enum";
import {Board} from "./board";
import {Cell} from "./cell";
import {Position} from "./position";
import {getOppositeDisk} from "../helpers/getOppositeDisk";

export class PossibleMovesFinder {
  private readonly streakFinder = new StreakFinder();

  getPossibleMoves(board: Board, color): Position[] {
    const moves: Position[] = [];
    board.getAllCells().forEach(({position, isEmpty}: Cell) => {

      if (!isEmpty || position.equeals(board.getBlackHole())) return;

      const streaks = this.streakFinder.getStreaksFor(position, board);

      const filteredStreaks = this.streakFinder.filterStreaks(streaks, color);

      if (filteredStreaks.length) {
        moves.push(position);
      }
    });

    return moves
  }

}

export class StreakFinder {
  getStreaksFor(origin: Position, board: Board): Cell[][] {
    const directionOffsets: Position[] = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x !== 0 || y !== 0) {
          directionOffsets.push(new Position(x, y))
        }
      }
    }
    const streaks: Cell[][] = [];

    directionOffsets.forEach((offset: Position) => {
      const streak: Cell[] = [];
      let next: Cell;
      let nextPosition: Position = origin;

      do {
        nextPosition = new Position(nextPosition.x + offset.x, nextPosition.y + offset.y);

        next = board.getCell(nextPosition);

        if (Boolean(next) && next.isOccupied) {
          streak.push(next);
        }

      } while (Boolean(next) && next.isOccupied);

      if (streak.length > 0) {
        streaks.push(streak);
      }
    });

    return streaks;
  }

  filterStreaks(streaks: Cell[][], color: ColorsEnum): Cell[][] {
    const filteredStreaks: Cell[][] = [];

    return streaks.reduce((acc, streak): Cell[][] => {
      const firstPoint = streak[0];
      const firstPieceOppositeColor = getOppositeDisk(firstPoint.color);

      if (
        streak.length > 1
        && firstPieceOppositeColor === color
        && streak.filter(c => c.isOccupied && c.color === firstPieceOppositeColor).length
      // && streak[streak.length - 1]?.color === color
      ) {
        if (firstPieceOppositeColor === color) acc.push(streak);
        acc.push(streak)
      }

      return acc
    }, filteredStreaks)
  }

  getStreaksForColor(origin: Position, board: Board, color: ColorsEnum): Cell[][] {
    const streaks = this.getStreaksFor(origin, board);

    return this.filterStreaks(streaks, color);
  }
}
