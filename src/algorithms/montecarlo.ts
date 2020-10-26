import {Game} from "../models/game";
import {Player} from "../models/player";
import {PossibleMovesFinder} from "../models/possibleMovesFinder";
import {Position} from "../models/position";

class State {
  private _game: Game;
  private _possibleMove: Position;
  private _currentPlayer: Player;
  private _visitCount: number = 0;
  private _winScore: number = 0;
  private possibleMovesFinder: PossibleMovesFinder = new PossibleMovesFinder();

  copy(): State {
    const newState = new State();
    newState.game = this._game;
    newState.possibleMove = this._possibleMove;
    newState.player = this.player;
    newState.visitCount = this.visitCount;
    newState.winScore = this.winScore;
    return newState
  }

  constructor();
  constructor(game: Game);

  constructor(game?) {
    if (game instanceof Game) {
      this._game = game.copy();
      this._currentPlayer = game.getCurrentPlayer()
    }

    return this;
  }

  set possibleMove(position: Position) {
    this._possibleMove = position
  }

  set game(game: Game) {
    this._game = game.copy();
  }

  set player(player: Player) {
    this._currentPlayer = player;
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

  get player(): Player {
    return this._currentPlayer
  }

  get possibleMove(): Position {
    return this._possibleMove;
  }

  incrementVisit() {
    this._visitCount++;
  }

  addScore(score: number) {
    this._winScore += score;
  }

  getAllPossibleStates() {
    const nextMoveCurrentPlayer = this._game.getOpponent(this._currentPlayer);
    const nextPlayerPossibleMoves: Position[] = this.possibleMovesFinder.getPossibleMoves(
      this.game.getBoard(),
      nextMoveCurrentPlayer.getDiscColor()
    );

    return nextPlayerPossibleMoves.map((position: Position) => {
      const state = new State(this._game.copy());
      state.player = nextMoveCurrentPlayer;
      state.possibleMove = position;
      //TODO: will not work
      state.game.makeMove(position);

      return state
    });
  }

  randomPlay() {
    const playerMoves = this.possibleMovesFinder.getPossibleMoves(
      this._game.getBoard(),
      this._game.getCurrentPlayer().getDiscColor()
    );

    const move = playerMoves[Math.floor(Math.random() * Math.floor(playerMoves.length))];

    this.game.makeMove(move && null);
  }


  togglePlayer() {
    // console.dir(this)
    this._currentPlayer = this._game.getOpponent(this._currentPlayer);
  }
}

class Node {
  private _state: State;
  private _parent: Node;
  private _childArray: Node[] = [];

  constructor();
  constructor(node: Node);
  constructor(state: State);

  constructor(data?) {
    if (data instanceof Node) {

    } else if (data instanceof State) {
      this._state = data.copy();
    }
  }

  copy() {
    const newNode = new Node(this.state);
    newNode.parent = this.parent;
    newNode.childArray = this.childArray.map((node) => node.copy());

    return newNode;
  }

  get state(): State {
    return this._state;
  }

  get childArray(): Node[] {
    return this._childArray
  }

  get parent(): Node {
    return this._parent
  }

  set childArray(childArray: Node[]) {
    this._childArray = childArray.map(node => node.copy());
  }

  set parent(parentNode: Node) {
    this._parent = parentNode;
  }

  addElementToChildArray(node: Node){
    this._childArray.push(node)
  }

  getRandomChildNode(): Node {
    const { childArray } = this;
    return childArray[Math.floor(Math.random() * Math.floor(childArray.length))]
  }

  getChildWithMaxScore(){
    let maxChildValue = 0;
    let maxChildIndex = 0;

    this.childArray.forEach((node: Node, index) => {
      if (node.state.visitCount > maxChildValue) {
        maxChildIndex = index;
      }
    });

    return this.childArray[maxChildIndex]
  }
}

class Tree {
  private _root: Node;

  constructor(game: Game) {
    this._root = new Node(
      new State(game.copy())
    )
  }

  get root(): Node {
    return this._root
  }

  set root(root: Node) {
    this._root = root;
  }
}

class UCT {
  public static utcValue(totalVisit: number, nodeWinScore: number, nodeVisit: number): number {
    if (nodeVisit == 0) {
      return Number.MAX_VALUE;
    }

    return nodeWinScore / nodeVisit + 1.41 * Math.sqrt(Math.log(totalVisit) / nodeVisit)
  }

  public static findBestNodeWithUCT(node: Node): Node {
    const parentVisit = node.state.visitCount;

    return this.findMaxValueAbleNode(node.childArray, parentVisit);
  }

  private static findMaxValueAbleNode(array: Node[], parentVisit: number) {
    let maxIndex = 0;
    let maxValue = 0;

    array.forEach((node: Node, index) => {
      if (this.utcValue(parentVisit, node.state.winScore, node.state.visitCount) > maxValue) {
        maxIndex = index
      }
    });

    return array[maxIndex];
  }
}

export class MonteCarloTreeSearch {
  static readonly WIN_SCORE = 10;
  level: number;
  opponentPlayer: Player;

  findNextMove(game: Game, player: Player): Position {

    this.opponentPlayer = game.getOpponent(player);
    const tree = new Tree(game);
    const rootNode = tree.root;

    rootNode.state.game = game;
    rootNode.state.player = this.opponentPlayer;

    const hrstart = process.hrtime();

    while (process.hrtime(hrstart)[0] < 2) {
      const promisingNode: Node = this.selectPromisingNode(rootNode);

      if (!promisingNode.state.game.getWinner()) {
        this.expandNode(promisingNode);
      }

      let nodeToExplore: Node = promisingNode;

      if (promisingNode.childArray.length > 0) {
        nodeToExplore = promisingNode.getRandomChildNode();
      }

      const playResult = this.simulateRandomPlay(nodeToExplore);

      this.backPropogation(nodeToExplore, playResult);
    }

    const winnerNode = rootNode.getChildWithMaxScore();

    if (!winnerNode) {
      return null
    }

    tree.root = winnerNode;

    return winnerNode.state.possibleMove;
  }

  private selectPromisingNode(rootNode: Node): Node {
    let node = rootNode;
    while (node.childArray.length != 0) {
      node = UCT.findBestNodeWithUCT(node);
    }

    return node;
  }

  private expandNode(node: Node) {
    const possibleStates: State[] = node.state.getAllPossibleStates();

    possibleStates.forEach(state => {
      const newNode: Node = new Node(state);
      newNode.parent = node;
      newNode.state.player = node.state.game.getOpponent(newNode.state.player);

      node.addElementToChildArray(newNode);
    });
  }

  private backPropogation(nodeToExplore: Node, player: Player) {
    let tempNode: Node = nodeToExplore;
    while (tempNode != null) {
      tempNode.state.incrementVisit();
      if (tempNode.state.player.getIndex() === player.getIndex()) {
        tempNode.state.addScore(MonteCarloTreeSearch.WIN_SCORE);
      }

      tempNode = tempNode.parent;
    }
  }

  private simulateRandomPlay(node: Node): Player {
    let tempNode: Node = node.copy();
    let tempState = tempNode.state;
    let gameHasWinner = tempState.game.getWinner();

    let currentPlayer = tempNode.state.game.getCurrentPlayer();

    if (gameHasWinner && gameHasWinner === this.opponentPlayer) {
      tempNode.parent.state.winScore = Number.MAX_VALUE;
      return currentPlayer
    }

    while (!tempNode.state.game.getWinner()) {
      tempState.togglePlayer();
      tempState.randomPlay();
      currentPlayer = tempState.game.getCurrentPlayer();
    }

    return currentPlayer
  }
}

