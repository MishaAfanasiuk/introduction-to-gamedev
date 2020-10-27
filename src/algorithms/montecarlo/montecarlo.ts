import {Game} from "../../models/game";
import {Player} from "../../models/player";
import {Position} from "../../models/position";
import { Tree } from './tree'
import { Node } from './node'
import {State} from "./state";
import {UCT} from "./utc";

export class MonteCarloTreeSearch {
  static readonly WIN_SCORE = 1;
  opponent: Player;
  currentPlayer: Player;

  findNextMove(game: Game, player: Player): Position {
    this.opponent = game.getOpponent(player);
    this.currentPlayer = player;

    const tree = new Tree(game);
    const rootNode = tree.root;

    rootNode.state.game = game;

    const hrstart = process.hrtime();

    while (process.hrtime(hrstart)[1] < 5e+8) {

      const promisingNode = this.selectPromisingNode(rootNode);

      this.expandNode(promisingNode);

      const winner = this.simulateRandomPlay(promisingNode);
      // throw winner
      this.backPropogation(promisingNode, winner);
    }

    // console.dir(
    //   rootNode.childArray.map(c => c.state.winScore)
    // );
    //
    // throw Error;

    const winnerNode = rootNode.getChildWithMaxScore();

    if (!winnerNode) {
      return null
    }

    // console.log(winnerNode.state.winScore);

    tree.root = winnerNode;

    return winnerNode.state.possibleMove;
  }

  private selectPromisingNode(rootNode: Node): Node {
    let node = rootNode;

    while (node.childArray.length !== 0) {
      // console.dir(node.childArray)
      node = UCT.findBestNodeWithUCT(node);
      // console.log(node)
    }

    // throw Error

    return node;
  }

  private expandNode(node: Node) {
    if (!node.state.game.getWinner()) {

      const possibleStates: State[] = node.state.getAllPossibleStates(this.currentPlayer);

      possibleStates.forEach(state => {
        const newNode: Node = new Node(state);
        newNode.parent = node;

        node.addElementToChildArray(newNode);
      });

      // console.log(possibleStates.map(s => s.game.getBoard().toString()));
      // console.log(possibleStates.map(s => s.winScore));
      // throw Error
    }
  }

  private simulateRandomPlay(node: Node): Player {
    let tempNode: Node = node.copy();

    while (!tempNode.state.game.getWinner()) {
      tempNode.state.randomPlay();
    }
    // console.log(tempNode.state.game.getBoard().toString())
    // throw 'a'
    return tempNode.state.getCurrentWinner();
  }

  private backPropogation(nodeToExplore: Node, player: Player) {
    let tempNode: Node = nodeToExplore;

    while (tempNode != null) {
      tempNode.state.incrementVisit();
      tempNode.state.addScore(
        player.getIndex() === this.currentPlayer.getIndex() ? MonteCarloTreeSearch.WIN_SCORE: 0
      );

      tempNode = tempNode.parent;
    }
  }
}

