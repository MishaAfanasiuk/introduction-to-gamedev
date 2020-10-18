import React, {useState} from 'react';
import './App.scss';
import {BoardView} from "../Board/Board";
import {Game} from "../../models/game";
import {Player} from "../../models/player";
import {FieldDiskEnum} from "../../enums/field-disk.enum";
import {Board} from "../../models/board";
import {Robot} from "../../models/robot";
import {GameTypeEnum} from "../../enums/game-type.enum";

function App() {
  const [game, setGame]: [Game | any, Function] = useState(null);

  const createGame = (gameType: GameTypeEnum) => {
    const games = {
      [GameTypeEnum.PLAYER_WITH_BOT]: (
        new Game(
          [
            new Player('Player 1', FieldDiskEnum.BLACK),
            new Robot(),
          ],
          new Board(),
          GameTypeEnum.PLAYER_WITH_BOT
        )
      ),
      [GameTypeEnum.TWO_PLAYERS]: (
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
    return games[gameType]
  };

  const onPlayWithBot = () => {
    setGame(
      createGame( GameTypeEnum.PLAYER_WITH_BOT)
    )
  };

  const onPlayWithPlayer = () => {
    setGame(
      createGame( GameTypeEnum.TWO_PLAYERS)
    )
  };

  const restartGame = () => {
    setGame(createGame(game.getGameType()))
  };

  return (
    <div className="App">
      <div onClick={restartGame}>
        Restart Game
      </div>

      <div onClick={onPlayWithBot}>
        Play with bot
      </div>
      <div onClick={onPlayWithPlayer}>
        Play with player
      </div>
      {
        game ? <BoardView game={game}/> : null
      }

    </div>
  );
}

export default App;
