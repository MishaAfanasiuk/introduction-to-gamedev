import {Player} from "./player";
import {Board} from "./board";
import {GameTypeEnum} from "../enums/game-type.enum";
import {Robot} from "./robot";
import {FieldDiskEnum} from "../enums/field-disk.enum";

type moc = {
  color: FieldDiskEnum,
  score: number,
  won: boolean,
}

type PlayersType = [Player, Player];

export class Game {
  private currentPlayerIndex: number = 0;
  private switchPlayerCount = 0;
  private winner: Player | null = null;

  constructor(
    private players: PlayersType,
    private board: Board,
    private gameType: GameTypeEnum,
  ) {}

  getGameType = () => {
    return this.gameType;
  };

  getWinner() {
    return this.winner
  }

  getPlayers() {
    return this.players;
  }

  getBoard() {
    return this.board;
  }

  getCurrentPlayer = () => {
    return this.players[this.currentPlayerIndex];
  };

  private endGame() {
    const [ player1, player2 ] = this.players;
    this.winner = player1.getScore() > player2.getScore() ? player1 : player2;
    // this.winner.gainResult(true);
    // if (player1.getScore() > player2.getScore()) {
    //   this.winner = player1;
    //   player1.gainResult(true);
    //   player2.gainResult(false);
    // } else {
    //   this.winner = player2;
    //   player2.gainResult(true);
    //   player1.gainResult(false);
    // }

  }

  private switchPlayer() {
    this.switchPlayerCount += 1;
    if (this.switchPlayerCount >= 2) {
      this.endGame();
    }

    this.currentPlayerIndex = this.currentPlayerIndex === 1 ? 0 : 1;

    if (!this.getBoard().getAvailableMoves(this.getCurrentPlayer().getDiscColor()).length) {
      this.switchPlayer();
    } else {
      this.switchPlayerCount = 0;
    }
  }

  private countPlayersScores() {
    const [ player1, player2 ] = this.players;
    let player1Score: number = 0, player2Score: number = 0;

    this.board.getField().forEach((row) => {
      row.forEach((field) => {
        if (field === player1.getDiscColor()) {
          player1Score += 1;
        } else if (field === player2.getDiscColor()) {
          player2Score += 1;
        }
      })
    });

    player1.setScore(player1Score);
    player2.setScore(player2Score);
  }

  makeMove(x:number, y:number) {
    const isMoveSuccess = this.board.makeMove(x, y, this.players[this.currentPlayerIndex].getDiscColor());
    if (isMoveSuccess) {
      this.switchPlayer();
      this.countPlayersScores();
    }
  }

  makeSmartDecision(bot: Robot) {
    let opponent = this.players[0].getName() === 'Bot' ? this.players[1] : this.players[0],
      moveNumber = 0,
      bestScore = 0,
      boardCopy = new Board(),
      possibleMoves = this.board.getAvailableMoves(bot.getDiscColor()),
      cycleRepeat = 0;
    boardCopy.field = this.board.field.map(x => x.slice());
    let robot = {score: bot.getScore(), color: bot.getDiscColor(), won: false};
    let enemy = {score: opponent.getScore(), color: opponent.getDiscColor(), won: false};

    possibleMoves.forEach((move, index) => {
      boardCopy.makeMove(move[0], move[1], bot.getDiscColor());
      console.log(move);
      let score = this.minimax(boardCopy, 0, true, robot, enemy, cycleRepeat);
      if( score > bestScore ) {
        moveNumber = index;
        bestScore = score;
      }
      boardCopy.field = this.board.field.map(x => x.slice());
    });

    // const moveNumber = Math.floor(Math.random() * Math.floor(possibleMoves.length));
    return possibleMoves[moveNumber];
  };

  minimax(board : Board, depth : number, robot_turn : boolean, bot: moc, opponent: moc, cycleRepeat: number) {

    console.log('im in');
    let bestScore: number;
    // console.log(cycleRepeat);
    if (depth > 100) {
      console.log('out');
      return 0;
    }
    if (cycleRepeat >1) {
      bot.score > opponent.score ? bot.won = true : opponent.won = true;
    }

    if (bot.won) {
      return  1000
    } else if (opponent.won) {
      return -1000
    }

    if(robot_turn) {
      bestScore = 0;
      let boardCopy = new Board();
      boardCopy.field = board.field.map(x => x.slice());
      if (board.getAvailableMoves(bot.color).length > 0) {
        cycleRepeat = 0;
        board.getAvailableMoves(bot.color).forEach((move) => {
          boardCopy.makeMove(move[0], move[1], bot.color);
          console.log('a');
          let score = this.minimax(boardCopy, depth + 1, false, bot, opponent, cycleRepeat);
          if( score > bestScore ) {
            bestScore = score;
          }
          boardCopy.field = board.field.map(x => x.slice());
        });
      } else {
        cycleRepeat += 1;
        console.log('boom')
        let score = this.minimax(boardCopy, depth + 1, false, bot, opponent, cycleRepeat);
        if( score > bestScore ) {
          bestScore = score;
        }
      }

    } else {
      bestScore = 100;
      let boardCopy = new Board();
      boardCopy.field = board.field.map(x => x.slice());
      if ( board.getAvailableMoves(opponent.color).length > 0 ) {
        cycleRepeat = 0;
        board.getAvailableMoves(opponent.color).forEach((move) => {
          boardCopy.makeMove(move[0], move[1], opponent.color);
          console.log('b');
          let score = this.minimax(boardCopy, depth + 1, true, bot, opponent, cycleRepeat);
          // let score = 1;
          if( score < bestScore ) {
            bestScore = score;
          }
          boardCopy.field = board.field.map(x => x.slice());
        });
      } else {
        cycleRepeat += 1
        console.log('baam');
        let score = this.minimax(boardCopy, depth + 1, true, bot, opponent, cycleRepeat);
        if( score < bestScore ) {
          bestScore = score;
        }
      }
    }

    return bestScore;
  }
}
