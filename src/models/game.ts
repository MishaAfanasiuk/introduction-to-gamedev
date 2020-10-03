import {Player} from "./player";
import {Board} from "./board";
import {GameTypeEnum} from "../enums/game-type.enum";

type PlayersType = [Player, Player];

export class Game {
  private currentPlayerIndex: number = 0;

  constructor(
    private players: PlayersType,
    private board: Board,
    private type: GameTypeEnum,
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
    if (this.getCurrentPlayer().getName() === 'Bot') {
      return
    }

    const isMoveSuccess = this.board.makeMove(x, y, this.players[this.currentPlayerIndex].getDiscColor());
    if (isMoveSuccess) {
      this.switchPlayer();
      console.log(this.players);
      console.log(this.getCurrentPlayer().getName());

      if (this.getCurrentPlayer().getName() === 'Bot') {
        const p: any = this.getCurrentPlayer();
        setTimeout(() => {
          const a = p.makeDecision();
          console.log(a, 'decision');
        }, 500)
      }
    }
  }
}
