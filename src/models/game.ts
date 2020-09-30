import {Player} from "./player";
import {Board} from "./board";

type PlayersType = [Player, Player];

export class Game {
  // private players: PlayersType;
  private currentPlayerIndex: number = 0;

  constructor(
    private players: PlayersType,
    private board: Board,
  ) {}

  startGame(players: PlayersType) {
    this.players = players;
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

  private switchPlayer() {
    this.currentPlayerIndex = this.currentPlayerIndex === 1 ? 0 : 1;
  }

  makeMove(x:number, y:number) {
    const isMoveSuccess = this.board.makeMove(x, y, this.players[this.currentPlayerIndex].getDiscColor());
    if (isMoveSuccess) {
      this.switchPlayer();
    }
  }
}
