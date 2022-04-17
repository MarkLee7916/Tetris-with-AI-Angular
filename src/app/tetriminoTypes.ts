import { Coord } from './game';
import { deepCopy, randomItemFromArray } from './utils';

const square: Coord[][] = [
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
];

const shapeT: Coord[][] = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 1],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [1, 1],
  ],
  [
    [1, 1],
    [1, 2],
    [1, 3],
    [0, 2],
  ],
  [
    [1, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
];

const line: Coord[][] = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
];

const shapeL: Coord[][] = [
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
  ],
  [
    [1, 1],
    [1, 2],
    [1, 3],
    [0, 3],
  ],
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [1, 2],
  ],
];

const mirror: Coord[][] = [
  [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 2],
    [1, 2],
    [1, 3],
    [0, 3],
  ],
  [
    [1, 1],
    [1, 2],
    [0, 2],
    [0, 3],
  ],
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
  ],
];

const blockTypes: Coord[][][] = [square, shapeT, line, shapeL, mirror];

export const getRandomBlock = () => deepCopy(randomItemFromArray(blockTypes));
