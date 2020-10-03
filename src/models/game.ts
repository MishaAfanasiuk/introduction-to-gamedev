import {Player} from "./player";
import {Board} from "./board";
import {GameTypeEnum} from "../enums/game-type.enum";

type PlayersType = [Player, Player];

export class Game {
  private currentPlayerIndex: number = 0;
  private switchPlayerCount = 0;

  constructor(
    private players: PlayersType,
    private board: Board,
    private gameType: GameTypeEnum,
  ) {}

  getGameType = () => {
    return this.gameType;
  };

  restartGame() {
    this.board = new Board();
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
    console.log('game ended!')
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
    let switches = 0;
    if (isMoveSuccess) {
      this.switchPlayer();
      this.countPlayersScores();
    }
  }
}
