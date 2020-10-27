import { Node } from './node';

export class UCT {
  public static utcValue(totalVisit: number, nodeWinScore: number, nodeVisit: number): number {
    if (nodeVisit == 0) {
      return Number.MAX_VALUE;
    }

    return nodeWinScore / nodeVisit + 1.41 * Math.sqrt(Math.log(totalVisit) / nodeVisit)
  }

  public static findBestNodeWithUCT(node: Node): Node {
    return this.findMaxValueAbleNode(node.childArray, node.state.visitCount);
  }

  private static findMaxValueAbleNode(array: Node[], totalVisit: number) {
    let maxIndex = 0;
    let maxValue = Number.MIN_SAFE_INTEGER;

    array.forEach((node: Node, index) => {
      const tempMaxValue = this.utcValue(totalVisit, node.state.winScore, node.state.visitCount);
      if (
        tempMaxValue > maxValue
      ) {
        maxValue = tempMaxValue;
        maxIndex = index
      }
    });

    return array[maxIndex];
  }
}
