import {FieldDiskEnum} from "../enums/field-disk.enum";

export class Board {
  readonly field: number[][];

  constructor(fieldSize = 8) {
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

    // const checks: any = [
    //   {
    //     axis: 'x',
    //     start: null,
    //     end: null,
    //     isCorrect: true,
    //   },
    //   {
    //     axis: 'y',
    //     start: null,
    //     end: null,
    //     isCorrect: true,
    //   },
    //   {
    //     axis: 'xy',
    //     start: null,
    //     end: null,
    //     isCorrect: true,
    //   },
    //   {
    //     axis: 'xyReverse',
    //     start: null,
    //     end: null,
    //     isCorrect: true,
    //   }
    // ];

    // for (let i = 0; i < field.length; i++) {
    //   const fields: any = {
    //     x: field[x][i],
    //     y: field[i][y],
    //     xy: field[x + y]?.[y - i],
    //     xyReverse: field[x - i]?.[y + i],
    //   };
    //
    //   checks.forEach((check: any) => {
    //     // if ()
    //
    //     if (!fields[check.axis] && !check.end && check.start) {
    //       check.isCorrect = false;
    //     }
    //
    //
    //     if (fields[check.axis] === disc) {
    //       if (check.start) {
    //         check.end = i;
    //       } else {
    //         check.start = i;
    //       }
    //     }
    //   });
    // }

    // let isMoveCorrect = false;

    // const moves = Object.values(checks).filter((check: any) => {
    //   return check.start && check.end && check.isCorrect
    // });
    //
    // console.log(moves.length);
    //
    // if (!moves.length) {
    //   this.field[x][y] = 0;
    // }
    //
    // moves.forEach((move: any) => {
    //   for (let i = move.start; i < move.end; i++) {
    //     this.changeField(field, move.axis, i, x, y, disc)
    //   }
    // });

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

    const correctMoves = moves.reduce((acc: any, { data, name }: any) => {
      if (!data) {
        return acc
      }

      for (let i = data.start; i < data.end; i++ ) {
        this.changeField(this.field, name, i, x, y, disc)
      }

      acc.push(true)
      return acc;
    }, []);

    if (!correctMoves.length) {
      this.field[x][y] = 0;
      return false
    }

    return true
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
        field[x+i][y + i] = disk;
        break;
      case 'xyReverse':
        field[x-i][y + i] = disk;
        break;
    }
  }

  private checkX = (field: any, x:number, y:number, disk: FieldDiskEnum) => {
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

  private checkY = (field: any, x:number, y:number, disk: FieldDiskEnum) => {
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

  private checkXY = (field: any, x:number, y:number, disk: FieldDiskEnum) => {
    let start: number = 0;
    let end: number = 0;

    let opposite = this.getOppositeDisk(disk);

    if (field[x - 1]?.[y - 1] === opposite) {
      for (let i = 1; i < (x < y ? x : y); i++) {
        if (field[x - i][y - i] === disk) {
          start = -i;
          break;
        } else if (!field[x - i][y - i]) {
          break
        }
      }
    }

    if (field[x + 1]?.[y + 1] === opposite) {
      for (let i = 1; i < ((field.length - x) < (field.length - y) ? (field.length - x) : (field.length - y)); i++) {
        if (field[x + i][y + i] === disk) {
          end = i;
          break;
        } else if (!field[x + i][y + i]) {
          break
        }
      }
    }

    if (Math.abs(start) <= 1 && Math.abs(end) <= 1) {
      return false
    }

    return {start, end};
  };

  private checkXYReverse = (field: any, x:number, y:number, disk: FieldDiskEnum) => {
    let start: number = 0;
    let end: number = 0;

    let opposite = this.getOppositeDisk(disk);

    if (field[x - 1]?.[y + 1] === opposite) {
      console.log('69+++')
      console.log(x, field.lenght - y);
      for (let i = 1; i <= (x < (field.length - y) ? x : (field.length - y)); i++) {
        console.log(x, field.length - y)
        if (field[x - i][y + i] === disk) {
          end = i;
          break;
        } else if (!field[x - i][y + i]) {
          break
        }
      }
    }

    if (field[x + 1]?.[y - 1] === opposite) {
      for (let i = 1; i <= (field.length - x < y ? field.length - x : y); i++) {
        if (field[x + i][y - i] === disk) {
          start = -i;
          break;
        } else if (!field[x + i][y - i]) {
          break
        }
      }
    }
    console.log(start, end)
    if (Math.abs(start) <= 1 && Math.abs(end) <= 1) {
      return false
    }
    console.log(start, end);

    if (end < 0) {
      return {start: end, end: start};
    }

    return {start, end};
  };



  private getOppositeDisk = (disk: FieldDiskEnum) => {
    return disk === FieldDiskEnum.WHITE ? FieldDiskEnum.BLACK : FieldDiskEnum.WHITE
  }
}

export const board = new Board();
