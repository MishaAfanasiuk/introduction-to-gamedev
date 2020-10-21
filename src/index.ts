import readline from 'readline';
import {Game} from "./models/game";
import {Player} from "./models/player";
import {FieldDiskEnum} from "./enums/field-disk.enum";
import {Robot} from "./models/robot";
import {Board} from "./models/board";
import {GameTypeEnum} from "./enums/game-type.enum";
import fs from 'fs';

let timeout;

const readLineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let blackHole: number[];
let botColor = '';
let game: Game;

const onReadFirstTwoLine = (line) => {
  if (!blackHole) {
    const [y, x] = line.split('');
    return blackHole = [x - 1, yNamesRevers[y]];
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
  const move = game.getCurrentPlayer()
    .makeDecision(
      game.getBoard()
        .getAvailableMoves(
          game.
          getCurrentPlayer()
            .getDiscColor()
        )
    );

  if (!move.length) {
    console.log('pass')
  } else {
    const [ x, y ] = move;

    game.makeMove(x, y);

    console.log(yNames[y] + [x + 1])
  }
};

const moveListener = (line) => {
  clearTimeout(timeout);

  const [y, x] = line.split('');

  game.makeMove(x - 1, yNamesRevers[y]);

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
        rStrings += (item || 0) + ' | '
      })
      rStrings += '\n'
    });

    fs.writeFileSync('./r.txt', rStrings);
    console.log(JSON.stringify(game.getBoard().field));
    process.exit(0)
  }, 3000)
};

const startGame = () => {
  timeout = setTimeout(() => {
    process.exit(0)
  }, 3000);


  game = new Game(
    [
      new Player('Tester', botColor === 'white' ? FieldDiskEnum.BLACK : FieldDiskEnum.WHITE),
      new Robot(botColor === 'white' ? FieldDiskEnum.WHITE : FieldDiskEnum.BLACK),
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
