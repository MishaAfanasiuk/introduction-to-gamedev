import {Position} from "../models/position";
import {Game} from "../models/game";
import {yNamesRevers} from "../constants/coordinates";
import readline from "readline";
import {Player} from "../models/player";
import {ColorsEnum} from "../enums/colors.enum";
import {Robot} from "../models/robot";
import {Board} from "../models/board";
import {GameTypeEnum} from "../enums/game-type.enum";
import {PossibleMovesFinder} from "../models/possibleMovesFinder";

export class TesterGame {
  timeout;
  blackHole: Position;
  botColor = '';
  game: Game;
  readLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  constructor() {
    this.readLineInterface.addListener('line', this.onReadFirstTwoLines);
  }

  private handleExecutionErrors = (e) => {
    console.log(e);
    process.exit(0);
  };

  private setExitTimeOut = () => {
    return setTimeout(() => {
      process.exit(0)
    }, 3000)
  };

  makeBotMove = () => {
    const {game, blackHole} = this;

    try {
      const possibleMovesFinder = new PossibleMovesFinder();

      const move: Position = game.getCurrentPlayer()
        .makeDecision(
          possibleMovesFinder
            .getPossibleMoves(
              game.getBoard(),
              blackHole,
              game.getCurrentPlayer().getDiscColor()
            )
        );

      if (!move) {
        console.log('pass')
      }

      const cell = game.makeMove(move);

      if (cell) {
        console.log(cell.positionToString())
      }

    } catch (e) {
      this.handleExecutionErrors(e)
    }
  };

  moveListener = (line) => {
    const {timeout, game, makeBotMove} = this;
    try {
      clearTimeout(timeout);

      const [y, x] = line.split('');

      game.makeMove(
        line === 'pass' ? null :
          new Position(x - 1, yNamesRevers[y])
      );

      makeBotMove();

      this.timeout = this.setExitTimeOut();
    } catch (e) {
      this.handleExecutionErrors(e)
    }
  };

  startGame = () => {
    this.timeout = this.setExitTimeOut();

    this.game = new Game(
      [
        new Player('Tester', this.botColor === 'white' ? ColorsEnum.BLACK : ColorsEnum.WHITE),
        new Robot(this.botColor === 'white' ? ColorsEnum.WHITE : ColorsEnum.BLACK),
      ],
      new Board(this.blackHole),
      GameTypeEnum.PLAYER_WITH_BOT,
      this.botColor === 'black' ? 1 : 0,
    );

    this.readLineInterface.addListener('line', this.moveListener);

    if (this.botColor === 'black') {
      this.makeBotMove();
    }
  };

  onReadFirstTwoLines = (line) => {
    if (!this.blackHole) {
      const [y, x] = line.split('');
      return this.blackHole = new Position(x - 1, yNamesRevers[y]);
    }

    if (!this.botColor) {
      this.botColor = line.toLowerCase();
    }

    this.startGame();
    this.readLineInterface.removeListener('line', this.onReadFirstTwoLines);
  }
}

new TesterGame();
