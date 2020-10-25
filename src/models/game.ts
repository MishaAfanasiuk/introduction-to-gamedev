import {Player} from "./player";
import {Board} from "./board";
import {GameTypeEnum} from "../enums/game-type.enum";
import {Position} from "./position";
import {Cell} from "./cell";

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
}
