import {Game} from "../../models/game";
import { Node } from './node';
import {State} from "./state";

export class Tree {
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
