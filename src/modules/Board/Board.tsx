import React, {useEffect, useState} from 'react';
import { board } from "../../models/board";
import './Board.scss'
import {Game} from "../../models/game";
import {FieldDiskEnum} from "../../enums/field-disk.enum";

const clickController = (x: number, y: number, game: Game, setState: Function) => {
  game.makeMove(x, y);

  setState([...game.getBoard().getField()]);

  const player = game.getCurrentPlayer();

  if (player.getName() === 'Bot') {
    setTimeout(() => {
      const [x, y] = player.makeDecision(game.getBoard().getAvailableMoves(player.getDiscColor()));
      clickController(x, y, game, setState)
    }, 500)
  }
};

const createController = (game: Game, setState: Function) => {
  return ({ target }: any) => {
    clickController(
      parseInt(target.getAttribute('aria-x')),
      parseInt(target.getAttribute('aria-y')),
      game,
      setState
    )
  }
};

export const BoardView = ({ game }: { game: Game }) => {
  const [field, setState]: [number[][], any] = useState(game.getBoard().getField());

  const onCellClick = createController(game, setState);

  useEffect(() => {
    setState(game.getBoard().getField())
  }, [game]);


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
