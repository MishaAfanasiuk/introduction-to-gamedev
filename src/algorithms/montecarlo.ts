import {Cell} from "../models/cell";

declare type State = Cell[][];

class Node {
  state: State;
  parent: Node;
  childArray: Node[];

}

class Tree {
  root: Node;
}
