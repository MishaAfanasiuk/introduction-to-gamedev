import React, {useState} from 'react';
import './App.scss';
import { BoardView } from "../Board/Board";
import {Game} from "../../models/game";
import {Player} from "../../models/player";
import {FieldDiskEnum} from "../../enums/field-disk.enum";
import {Board} from "../../models/board";
import {GameTypeEnum} from "../../enums/game-type.enum";
import {Robot} from "../../models/robot";

function App() {
  const [game, setGame]: [Game | null, Function] = useState(null);

  const onPlayWithBot = () => {
    const board = new Board();
    setGame(
      new Game(
        [
          new Player('Player 1', FieldDiskEnum.BLACK),
          new Robot(board),
        ],
        board,
        GameTypeEnum.PLAYER_WITH_BOT
      )
    )
  };

  const onPlayWithPlayer = () => {
    setGame(
      new Game(
        [
          new Player('Player 1', FieldDiskEnum.BLACK),
          new Player('Player 2', FieldDiskEnum.WHITE)
        ],
        new Board(),
        GameTypeEnum.TWO_PLAYERS
      )
    )
  };

  return (
    <div className="App">
      <div onClick={onPlayWithBot}>
        Play with bot
      </div>
      <div onClick={onPlayWithPlayer}>
        Play with player
      </div>
      {
        game ? <BoardView game={game} /> : null
      }

    </div>
  );
}

export default App;
