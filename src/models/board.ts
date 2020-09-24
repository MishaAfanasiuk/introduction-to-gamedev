export class Board {
  private field: number[][];

  constructor(fieldSize = 8) {
    this.field = new Array(fieldSize).map(() => new Array(fieldSize))
  }
}
