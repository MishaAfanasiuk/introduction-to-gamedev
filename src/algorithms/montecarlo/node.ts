import {State} from "./state";

export class Node {
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
      this._state.winScore = 0;
      this._state.visitCount = 0;
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
    return childArray[Math.floor(Math.random() * childArray.length)]
  }

  getChildWithMaxScore(){
    let maxChildValue = Number.MAX_SAFE_INTEGER;
    let maxChildIndex = 0;


    this.childArray.forEach((node: Node, index) => {
      if (node.state.winScore < maxChildValue) {
        maxChildValue = node.state.winScore;
        maxChildIndex = index;
      }
    });

    return this.childArray[maxChildIndex]
  }
}

