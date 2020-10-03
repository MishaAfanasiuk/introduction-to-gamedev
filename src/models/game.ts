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
    })
  }

  private checkAvailableMove = () => {

  }

  makeMove(x:number, y:number, setState: Function) {
    const isMoveSuccess = this.board.makeMove(x, y, this.players[this.currentPlayerIndex].getDiscColor());

    if (isMoveSuccess) {
      this.switchPlayer();
      setState(this.board.getField());
      this.countPlayersScores();

      const player = this.getCurrentPlayer();

      if (player.getName() === 'Bot') {
        setTimeout(() => {

          const a = player.makeDecision(this.board.getAvailableMoves(player.getDiscColor()));

          this.makeMove(a[0], a[1], setState);
        }, 500)
      }
    }
  }
}
