export class Position {
  constructor(
    public readonly x,
    public readonly y
  ) {}

  equeals(position: Position) {
    return this.x === position.x && this.y === position.y
  }
}
