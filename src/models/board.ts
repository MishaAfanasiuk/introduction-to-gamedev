import {FieldDiskEnum} from "../enums/field-disk.enum";

export class Board {
  readonly field: number[][];

  constructor(
    private blackHole: number[],
    fieldSize = 8
  ) {
    this.field = [...new Array(fieldSize)].map(() => [...new Array(fieldSize)])
    this.field[4][3] = FieldDiskEnum.BLACK;
    this.field[3][4] = FieldDiskEnum.BLACK;

    this.field[3][3] = FieldDiskEnum.WHITE;
    this.field[4][4] = FieldDiskEnum.WHITE;
  }

  getField() {
    return this.field
  }

  makeMove(x: number, y: number, disc: FieldDiskEnum) {
    this.field[x][y] = disc;
    const field = this.field;

    const moves: any = [
      {
        name: 'x',
        data: this.checkX(field, x, y, disc)
      },
      {
        name: 'y',
        data: this.checkY(field, x, y, disc)
      },
      {
        name: 'xy',
        data: this.checkXY(field, x, y, disc)
      },
      {
        name: 'xyReverse',
        data: this.checkXYReverse(field, x, y, disc)
      }
    ];

    const correctMoves = moves.reduce((acc: any, {data, name}: any) => {
      if (!data) {
        return acc
      }

      for (let i = data.start; i < data.end; i++) {
        this.changeField(this.field, name, i, x, y, disc)
      }

      acc.push(true)
      return acc;
    }, []);

    if (!correctMoves.length) {
      this.field[x][y] = 0;
      return false
    }

    return [x, y]
  }

  getAvailableMoves(diskColor: FieldDiskEnum) {
    let possibleMoves: number[][] = [];
    let myDiscs = this.getMyDiscs(diskColor);
    myDiscs.forEach((item) => {
      const nearbyBlack = this.getNearbyEnemy(item, diskColor);
      nearbyBlack.forEach((itemBlack) => {
        let a = itemBlack[0] - item[0];
        let b = itemBlack[1] - item[1];
        let x = itemBlack[0];
        let y = itemBlack[1];

        while (this.field?.[x + a]?.[y + b] !== diskColor &&
        x > 0 &&
        y > 0 &&
        x < this.field.length - 1 &&
        y < this.field.length - 1) {
          x = x + a;
          y = y + b;
          if (
            this.field[x][y] !== this.getOppositeDisk(diskColor) &&
            !(x === this.blackHole[0] && y === this.blackHole[1])
          ) {
            possibleMoves.push([x, y]);
            return
          }
        }
      })
    });
    return possibleMoves;
  };

  private getMyDiscs(diskColor: FieldDiskEnum) {
    let result: number[][] = [];
    this.field.forEach((item, row) => {
      item.forEach((item, column) => {
        if (item === diskColor) {
          result.push([row, column]);
        }
      })
    });
    return result;
  }

  private getNearbyEnemy([x, y]: number[], diskColor: FieldDiskEnum) {
    let result = [];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (this.field?.[x + i]?.[y + j] === this.getOppositeDisk(diskColor)) {
          result.push([x + i, y + j]);
        }
      }
    }
    return result;
  }

  private changeField(field: any, axis: string, i: number, x: number, y: number, disk: FieldDiskEnum) {
    switch (axis) {
      case 'x':
        field[x][i] = disk;
        break;
      case 'y':
        field[i][y] = disk;
        break;
      case 'xy':
        field[x + i][y + i] = disk;
        break;
      case 'xyReverse':
        field[x - i][y + i] = disk;
        break;
    }
  }

  private checkX = (field: any, x: number, y: number, disk: FieldDiskEnum) => {
    let start: number = y;
    let end: number = y;
    let opposite = this.getOppositeDisk(disk);

    if (field[x][y - 1] === opposite) {
      for (let i = y - 1; i > 0; i--) {
        if (field[x][i] === disk) {
          start = i;
          break;
        } else if (!field[x][i]) {
          break
        }
      }
    }

    if (field[x][y + 1] === opposite) {
      for (let i = y + 1; i < field.length; i++) {
        if (field[x][i] === disk) {
          end = i;
          break;
        } else if (!field[x][i]) {
          break
        }
      }
    }

    if (Math.abs(start - y) <= 1 && Math.abs(end - y) <= 1) {
      return false
    }

    return {start, end};
  };

  private checkY = (field: any, x: number, y: number, disk: FieldDiskEnum) => {
    let start: number = x;
    let end: number = x;
    let opposite = this.getOppositeDisk(disk);

    if (field[x - 1]?.[y] === opposite) {
      for (let i = x - 1; i > 0; i--) {
        if (field[i][y] === disk) {
          start = i;
          break;
        } else if (!field[i][y]) {
          break
        }
      }
    }

    if (field[x + 1]?.[y] === opposite) {
      for (let i = x + 1; i < field.length; i++) {
        if (field[i][y] === disk) {
          end = i;
          break;
        } else if (!field[i][y]) {
          break
        }
      }
    }

    if (Math.abs(start - x) <= 1 && Math.abs(end - x) <= 1) {
      return false
    }

    return {start, end};
  };

  private checkXY = (field: any, x: number, y: number, disk: FieldDiskEnum) => {
    let start: number = 0;
    let end: number = 0;

    let opposite = this.getOppositeDisk(disk);

    if (field[x - 1]?.[y - 1] === opposite) {
      for (let i = 1; i < (x < y ? x : y); i++) {
        if (field[x - i]?.[y - i] === disk) {
          start = -i;
          break;
        } else if (!field[x - i]?.[y - i]) {
          break
        }
      }
    }

    if (field[x + 1]?.[y + 1] === opposite) {
      for (let i = 1; i < ((field.length - x) < (field.length - y) ? (field.length - x) : (field.length - y)); i++) {
        if (field[x + i]?.[y + i] === disk) {
          end = i;
          break;
        } else if (!field[x + i]?.[y + i]) {
          break
        }
      }
    }

    if (Math.abs(start) <= 1 && Math.abs(end) <= 1) {
      return false
    }

    return {start, end};
  };

  private checkXYReverse = (field: any, x: number, y: number, disk: FieldDiskEnum) => {
    let start: number = 0;
    let end: number = 0;

    let opposite = this.getOppositeDisk(disk);

    if (field[x - 1]?.[y + 1] === opposite) {
      for (let i = 1; i <= (x < (field.length - y) ? x : (field.length - y)); i++) {
        if (field[x - i]?.[y + i] === disk) {
          end = i;
          break;
        } else if (!field[x - i]?.[y + i]) {
          break
        }
      }
    }

    if (field[x + 1]?.[y - 1] === opposite) {
      for (let i = 1; i <= (field.length - x < y ? field.length - x : y); i++) {
        if (field[x + i]?.[y - i] === disk) {
          start = -i;
          break;
        } else if (!field[x + i]?.[y - i]) {
          break
        }
      }
    }

    if (Math.abs(start) <= 1 && Math.abs(end) <= 1) {
      return false
    }

    if (end < 0) {
      return {start: end, end: start};
    }

    return {start, end};
  };

  private getOppositeDisk = (disk: FieldDiskEnum) => {
    return disk === FieldDiskEnum.WHITE ? FieldDiskEnum.BLACK : FieldDiskEnum.WHITE
  }
}
