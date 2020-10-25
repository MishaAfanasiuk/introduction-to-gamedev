import readline from 'readline';
import {Game} from "./models/game";
import {Player} from "./models/player";
import {ColorsEnum} from "./enums/colors.enum";
import {Robot} from "./models/robot";
import {Board} from "./models/board";
import {GameTypeEnum} from "./enums/game-type.enum";
import fs from 'fs';
import {PossibleMovesFinder} from "./models/possibleMovesFinder";
import {Position} from "./models/position";

let timeout;

const readLineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let blackHole: Position;
let botColor = '';
let game: Game;

const wMoves = [];
const bMoves = [];

const onReadFirstTwoLine = (line) => {
  if (!blackHole) {
    const [y, x] = line.split('');
    return blackHole = new Position(x - 1, yNamesRevers[y]);
  }

  if (!botColor) {
    botColor = line.toLowerCase();
  }

  startGame();
  readLineInterface.removeListener('line', onReadFirstTwoLine);
};

const yNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const yNamesRevers = {
  'A': 0,
  'B': 1,
  'C': 2,
  'D': 3,
  'E': 4,
  'F': 5,
  'G': 6,
  'H': 7,
};

const makeBotMove = () => {
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

        // game.getBoard()
        //   .getAvailableMoves(
        //     game
        //       .getCurrentPlayer()
        //       .getDiscColor()
        //   )
      );

    // const move = game.makeSmartDecision(game.getCurrentPlayer());

    if (!move) {
      (botColor === 'black' ? bMoves: wMoves).push(new Position(-1, -1));
      console.log('pass')
      fs.writeFileSync('./possibleMoves.txt', JSON.stringify(
        possibleMovesFinder
          .getPossibleMoves(
            game.getBoard(),
            blackHole,
            game.getCurrentPlayer().getDiscColor()
          ),
        null,
        2
      ))
    } else {
      const cell = game.makeMove(move);

      if (cell) {
        (botColor === 'black' ? bMoves: wMoves).push(move);
        console.log(cell.positionToString())
      }


    }
  } catch (e) {
    fs.writeFileSync('./error.txt', e)
    console.log(e)
  }
};

const moveListener = (line) => {
  try {
    clearTimeout(timeout);

    const [y, x] = line.split('');

    game.makeMove(
      line === 'pass' ? null :
      new Position(x - 1, yNamesRevers[y])
    );
    (botColor !== 'black' ? bMoves: wMoves).push({x: x - 1, y: yNamesRevers[y]});

    makeBotMove();

    timeout = setTimeout(() => {
      let rStrings = '  | ';

      yNames.forEach((item) => {
        rStrings += item + ' | '
      });

      rStrings += '\n'

      game.getBoard().getField().forEach((row, index) => {
        rStrings += index + 1  + ' | ';
        row.forEach(item => {
          rStrings += (item ||  ' ') + ' | '
        })
        rStrings += '\n'
      });

      fs.writeFileSync('./r.txt', JSON.stringify({bMoves, wMoves, blackHole}));
      fs.writeFileSync('./r1.txt',
        JSON.stringify(game.getBoard().field.map(r => r.map(c => c.toString())), null, 2)
      );

      process.exit(0)
    }, 3000)
  } catch (e) {
    fs.writeFileSync('./error.txt', e)

    console.log(e)
  }
};

const startGame = () => {
  timeout = setTimeout(() => {
    process.exit(0)
  }, 3000);


  game = new Game(
    [
      new Player('Tester', botColor === 'white' ? ColorsEnum.BLACK : ColorsEnum.WHITE),
      new Robot(botColor === 'white' ? ColorsEnum.WHITE : ColorsEnum.BLACK),
    ],
    new Board(blackHole),
    GameTypeEnum.PLAYER_WITH_BOT,
    botColor === 'black' ? 1 : 0,
  );

  readLineInterface.addListener('line', moveListener);

  if (botColor === 'black') {
    makeBotMove();
  }
};

readLineInterface.addListener('line', onReadFirstTwoLine);
