import {ColorsEnum} from "../enums/colors.enum";
import {Position} from "./position";
import {yNames} from "../constants/coordinates";

export class Cell {
  private _color: ColorsEnum = ColorsEnum.NO_COLOR;
  private _isEmpty = true;

  constructor(
    private _position: Position
  ){}

  copy() {
    const newCell = new Cell(this.position);

    if (this.color !== ColorsEnum.NO_COLOR) {
      newCell.color = this.color;
    }

    return newCell;
  }

  positionToString = () => {
    return yNames[this._position.y] + [this._position.x + 1]
  };

  get isOccupied(): boolean {
    return !this.isEmpty;
  }

  get isEmpty(): boolean {
    return this._isEmpty
  }

  get color(): ColorsEnum {
    return this._color
  }

  set color(color: ColorsEnum) {
    this._isEmpty = false;
    this._color = color
  }

  get position(): Position {
    return this._position
  }

  removeColor() {
    this._isEmpty = true;
    this._color = ColorsEnum.NO_COLOR;
  }

  toString() {
    if (this._color === ColorsEnum.BLACK) {
      return '*'
    } else if (this._color === ColorsEnum.WHITE) {
      return '0'
    } else {
      return ' '
    }
  }

}
