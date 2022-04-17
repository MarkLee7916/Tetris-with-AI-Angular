import {
  clearFilledLines,
  EMPTY_TILE,
  GAME_HEIGHT,
  GAME_WIDTH,
  getFloorRow,
  Grid,
  isValidLocation,
  mapTetriminoToMainGrid,
} from './game';
import { Tetrimino, TILE_COUNT } from './tetrimino';

// Encodes a move and its score
type MoveEvaluation = {
  col: number;
  tetrimino: Tetrimino;
  score: number;
};

// Encodes a move and whether it requires to swap with the holding tetrimino
type Move = {
  col: number;
  tetrimino: Tetrimino;
  isHold: boolean;
};

// Get the optimal move, taking into account the possibility of swapping with the hold piece
export const computeOptimalMove = (
  currentTetrimino: Tetrimino,
  holdTetrimino: Tetrimino,
  grid: Grid
): Move => {
  const optimalMoveCurrentTetrimino = computeOptimalMoveForTetrimino(
    currentTetrimino,
    grid
  );
  const optimalMoveHoldTetrimino = computeOptimalMoveForTetrimino(
    holdTetrimino,
    grid
  );

  return optimalMoveCurrentTetrimino.score > optimalMoveHoldTetrimino.score
    ? {
        col: optimalMoveCurrentTetrimino.col,
        tetrimino: optimalMoveCurrentTetrimino.tetrimino,
        isHold: false,
      }
    : {
        col: optimalMoveHoldTetrimino.col,
        tetrimino: optimalMoveHoldTetrimino.tetrimino,
        isHold: true,
      };
};

// Return the column and rotation of the best move we can make with the given tetrimino
const computeOptimalMoveForTetrimino = (
  tetrimino: Tetrimino,
  grid: Grid
): MoveEvaluation => {
  let optimalTetrimino: Tetrimino = tetrimino;
  let optimalCol = Number.NEGATIVE_INFINITY;
  let optimalHeuristicScore = Number.NEGATIVE_INFINITY;

  for (let col = 0; col < GAME_WIDTH; col++) {
    for (let rotation = 0; rotation < TILE_COUNT; rotation++) {
      const floorRow = getFloorRow(0, col, grid, tetrimino);

      if (isValidLocation(floorRow, col, grid, tetrimino)) {
        const gridFromMove = clearFilledLines(
          mapTetriminoToMainGrid(floorRow, col, grid, tetrimino)
        );
        const heuristicScore = computeHeuristic(gridFromMove, floorRow);

        if (heuristicScore > optimalHeuristicScore) {
          optimalHeuristicScore = heuristicScore;
          optimalCol = col;
          optimalTetrimino = tetrimino;
        }
      }

      tetrimino = tetrimino.nextRotation();
    }
  }

  return {
    col: optimalCol,
    tetrimino: optimalTetrimino,
    score: optimalHeuristicScore,
  };
};

// Given a grid, evaluate how favourable it is by giving it a score
const computeHeuristic = (grid: Grid, rowOffset: number) => {
  if (rowOffset < TILE_COUNT) {
    return Number.MIN_SAFE_INTEGER + rowOffset;
  }

  let rating = 0;

  for (let row = 1; row < GAME_HEIGHT; row++) {
    for (let col = 0; col < GAME_WIDTH; col++) {
      if (coordHasEmptyHole(row, col, grid)) {
        rating -= 10;
      }
    }
  }

  return rating - (GAME_HEIGHT - rowOffset);
};

// Return true if position has an empty space with a filled piece on top of it
const coordHasEmptyHole = (row: number, col: number, grid: Grid) => {
  const isEmptyBelow = grid[row][col] === EMPTY_TILE;
  const isFilledAbove = grid[row - 1][col] !== EMPTY_TILE;

  return isEmptyBelow && isFilledAbove;
};
