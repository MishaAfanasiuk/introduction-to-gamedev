import {Game} from "../../models/game";
import {Position} from "../../models/position";
import {PossibleMovesFinder} from "../../models/possibleMovesFinder";
import {Player} from "../../models/player";

export class State {
  private _game: Game;
  private _possibleMove: Position;
  private _visitCount: number = 0;
  private _winScore: number = 0;
  private possibleMovesFinder: PossibleMovesFinder = new PossibleMovesFinder();

  copy(): State {
    const newState = new State();
    newState.game = this._game;
    newState.possibleMove = this._possibleMove;
    newState.visitCount = 0;
    newState.winScore = 0;
    return newState
  }

  constructor();
  constructor(game: Game);

  constructor(game?) {
    if (game instanceof Game) {
      this._game = game.copy();
    }

    return this;
  }

  set possibleMove(position: Position) {
    this._possibleMove = position
  }

  set game(game: Game) {
    this._game = game.copy();
  }

  set visitCount(visitCount: number) {
    this._visitCount = visitCount;
  }

  set winScore(winScore: number) {
    this._winScore = winScore;
  }

  get visitCount() {
    return this._visitCount
  }

  get winScore() {
    return this._winScore
  }

  get game(): Game {
    return this._game;
  }

  get possibleMove(): Position {
    return this._possibleMove;
  }

  getCurrentWinner() {
    const players = this.game.getPlayers();
    return players[0].getScore() > players[1].getScore() ? players[0] : players[1];
  }

  incrementVisit() {
    this._visitCount++;
  }

  addScore(score: number) {
    this._winScore += score;
  }

  getAllPossibleStates(currentPlayer: Player) {

    const nextPlayerPossibleMoves: Position[] = this.possibleMovesFinder.getPossibleMoves(
      this.game.getBoard(),
      this.game.getCurrentPlayer().getDiscColor()
    );

    return nextPlayerPossibleMoves.map((position: Position) => {
      const state = new State(
        this._game.copy()
      );

      state.visitCount = 0;
      state.possibleMove = position;

      state.game.makeMove(position);

      const currentStatePlayer = state.game.getPlayers()[currentPlayer.getIndex()];

      return state
    });
  }

  randomPlay() {
    const playerMoves = this.possibleMovesFinder.getPossibleMoves(
      this._game.getBoard(),
      this._game.getCurrentPlayer().getDiscColor()
    );
    const move = playerMoves[Math.floor(Math.random() * playerMoves.length)];
    this.game.makeMove(move || null);
  }
}
