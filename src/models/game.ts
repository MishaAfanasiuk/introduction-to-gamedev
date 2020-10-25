import {Player} from "./player";
import {Board} from "./board";
import {GameTypeEnum} from "../enums/game-type.enum";
import {Position} from "./position";
import {Cell} from "./cell";
import {Robot} from "./robot";

type PlayersType = [Player, Player];

export class Game {
  private winner: Player | null = null;
  passCount = 0;

  constructor(
    private players: PlayersType,
    private board: Board,
    private gameType: GameTypeEnum,
    private currentPlayerIndex: number = 0,
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
    const [player1, player2] = this.players;
    this.winner = player1.getScore() > player2.getScore() ? player1 : player2;
  }

  private switchPlayer() {
    this.currentPlayerIndex = this.currentPlayerIndex === 1 ? 0 : 1;
  }

  private countPlayersScores() {
    const [player1, player2] = this.players;
    let player1Score: number = 0, player2Score: number = 0;

    this.board.getField().forEach((row) => {
      row.forEach((field) => {
        if (field.color === player1.getDiscColor()) {
          player1Score += 1;
        } else if (field.color === player2.getDiscColor()) {
          player2Score += 1;
        }
      })
    });

    player1.setScore(player1Score);
    player2.setScore(player2Score);
  }

  makeMove(position: Position): Cell| null {
    if (!position) {
      this.passCount++;

      this.switchPlayer();

      if (this.passCount >= 2) {
        this.winner = this.getCurrentPlayer();
      }

      return null
    }

    this.passCount = 0;

    const move = this.board.makeMove(position, this.players[this.currentPlayerIndex].getDiscColor());

    if (move) {
      this.switchPlayer();
      this.countPlayersScores();
    }

    return move && this.board.getCell(move)
  }
  private countPlayersScoresMM(board: Board, bot, opponent) {
    let player1Score: number = 0, player2Score: number = 0;

    board.getField().forEach((row) => {
      row.forEach((field) => {
        if (field === bot.color) {
          player1Score += 1;
        } else if (field === opponent.color) {
          player2Score += 1;
        }
      })
    });

    return [player1Score, player2Score]
  }
  makeSmartDecision(bot: Robot) {
    let opponent = this.players[0].getName() === 'Bot' ? this.players[1] : this.players[0],
      moveNumber = 0,
      bestScore = 0,
      boardCopy = new Board(this.board.getBlackHole()),
      possibleMoves = this.board.getAvailableMoves(bot.getDiscColor()),
      cycleRepeat = 0;
    boardCopy.field = this.board.field.map(x => x.slice());
    let robot = {score: bot.getScore(), color: bot.getDiscColor(), won: false};
    let enemy = {score: opponent.getScore(), color: opponent.getDiscColor(), won: false};

    possibleMoves.forEach((move, index) => {
      boardCopy.makeMove(move[0], move[1], robot.color);
      // console.log('a');
      let scores = this.countPlayersScoresMM(boardCopy);
      robot.score = scores[1];
      enemy.score = scores[0];
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

  minimax(board : Board, depth : number, robot_turn : boolean, bot: moc, opponent: moc, cycleRepeat: number ) {
    console.log('im in');
    console.log(bot.score);
    console.log(opponent.score);
    let bestScore: number;

    if (cycleRepeat >1 || depth > 2) {
      // bot.score > opponent.score ? bot.won = true : opponent.won = true;
      // console.log('bot.won ' + bot.won)
      if (bot.score > opponent.score) {
        console.log('boooooooooot');
        return  1000
      } else if (bot.score < opponent.score) {
        console.log('niiiiiiiiht');
        return -1000
      } else {
        return 0
      }
    }


    if(robot_turn) {
      // let moves = board.getAvailableMoves(bot.color);
      let moves = ossibleMovesFinder
        .getPossibleMoves(
          game.getBoard(),
          blackHole,
          game.getCurrentPlayer().getDiscColor()
        )
      bestScore = 0;
      let boardCopy = new Board(this.board.getBlackHole());
      boardCopy.field = board.field.map(x => x.slice());
      if (moves.length > 0) {
        cycleRepeat = 0;
        moves.forEach((move) => {
          // console.log(moves);
          // console.log(move);
          boardCopy.makeMove(move[0], move[1], bot.color);
          // console.log('a');
          let scores = this.countPlayersScoresMM(boardCopy, bot, opponent);
          bot.score = scores[1];
          opponent.score = scores[0];
          let score = this.minimax(boardCopy, depth + 1, false, bot, opponent, cycleRepeat);
          if( score > bestScore ) {
            bestScore = score;
          }
          boardCopy.field = board.field.map(x => x.slice());
        });
      } else {
        cycleRepeat += 1;
        // console.log('boom')
        let score = this.minimax(boardCopy, depth + 1, false, bot, opponent, cycleRepeat);
        if( score > bestScore ) {
          bestScore = score;
        }
      }

    } else {
      let moves = board.getAvailableMoves(opponent.color)
      bestScore = 100;
      let boardCopy = new Board(this.board.getBlackHole());
      boardCopy.field = board.field.map(x => x.slice());
      if ( moves.length > 0 ) {
        cycleRepeat = 0;
        moves.forEach((move) => {
          // console.log(moves)
          // console.log(move)
          boardCopy.makeMove(move[0], move[1], opponent.color);
          // console.log('b');
          let scores = this.countPlayersScoresMM(boardCopy, bot, opponent);
          bot.score = scores[1];
          opponent.score = scores[0];
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
