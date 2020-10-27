import {Position} from "../models/position";

const bestPositions = [
  // Corners
  new Position(0, 0),
  new Position(0, 7),
  new Position(7, 0),
  new Position(7, 7),
];

const badPositions: Position[] = [];

for (let i = 0; i < 4; i++) {
  bestPositions.push(
    new Position(0, 2 + i),
    new Position(7, 2 + i),
    new Position(2 + i, 0),
    new Position(2 + i, 7),
  );
}

for (let i = 0; i < 4; i++) {
  badPositions.push(
    new Position(1, 2 + i),
    new Position(6, 2 + i),
    new Position(2 + i, 1),
    new Position(2 + i, 6),
  );
}

export const getScoresForPosition = (position: Position) => {
  if (bestPositions.find(best => best.equeals(position))) {
    return Number.MAX_SAFE_INTEGER
  }

  if (badPositions.find(bad => bad.equeals(position))) {
    return Number.MIN_SAFE_INTEGER
  }

  return 0
};
