import React, {useState} from 'react';
import {Board, board} from "../../models/board";
import './Board.scss'
import {Game} from "../../models/game";
import {FieldDiskEnum} from "../../enums/field-disk.enum";
import {Player} from "../../models/player";
import {GameTypeEnum} from "../../enums/game-type.enum";

// const game = new Game(
//   [
//     new Player('Player 1', FieldDiskEnum.BLACK),
//     new Player('Player 2', FieldDiskEnum.WHITE)
//   ],
//   new Board(),
//   GameTypeEnum.TWO_PLAYERS
// );

export const BoardView = ({ game }: { game: Game }) => {
  const [field, setState]: [number[][], any] = useState(game.getBoard().getField());

  const onCellClick = ({ target }: any) => {
    game.makeMove(
      parseInt(target.getAttribute('aria-x')),
      parseInt(target.getAttribute('aria-y')),
      setState
    );

    setState([...game.getBoard().getField()])
  };

  return (
    <div>
      <table className={'board'}>
        {
          field.map((row, x) => {
            return (
              <tr className={'board_row'} key={x}>
                {
                  row.map((value, y) => {
                    return (
                      <td
                        key={y}
                        className={`board_cell`}
                        onClick={value ? undefined : onCellClick}
                        aria-x={x}
                        aria-y={y}
                      >
                        <span className={`${value ? 'board_dot board_dot_' + FieldDiskEnum[value].toLowerCase() : ''}`}>

                        </span>
                      </td>
                    )
                  })
                }
              </tr>
            )
          })
        }
      </table>

      <div>
        Current player:&nbsp;
        {
          game.getCurrentPlayer().getName()
        }
      </div>
    </div>
  )
};
