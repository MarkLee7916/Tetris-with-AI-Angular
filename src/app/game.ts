import { Tetrimino } from './tetrimino';
import { deepCopy } from './utils';

// Represents a coordinate in the grid
export type Coord = [number, number];

// Represents the game's grid, where each number is a tile's ID
export type Grid = number[][];

export const GAME_HEIGHT = 22;

export const GAME_WIDTH = 10;

// The size of the 'hold' and 'next block' preview grids
export const PREVIEW_SIZE = 4;

// Represents a tile that doesn't have a block in it
export const EMPTY_TILE = -1;

export const isOnGrid = (row: number, col: number) =>
  row >= 0 && row < GAME_HEIGHT && col >= 0 && col < GAME_WIDTH;

export const generateEmptyGrid = (height: number, width: number) => {
  const grid: Grid = [];

  for (let row = 0; row < height; row++) {
    grid.push(generateEmptyRow(width));
  }

  return grid;
};

export const generateEmptyRow = (width: number) =>
  Array(width).fill(EMPTY_TILE);

// Return true if tetrimino isn't colliding with any blocks or is out of bounds
export const isValidLocation = (
  rowOffset: number,
  colOffset: number,
  grid: Grid,
  tetrimino: Tetrimino
) =>
  tetrimino
    .coords()
    .every(
      ([row, col]) =>
        isOnGrid(row + rowOffset, col + colOffset) &&
        grid[row + rowOffset][col + colOffset] === EMPTY_TILE
    );

// Return true if no tiles in some row are empty
export const isFullRow = (row: number[]) =>
  row.every((value) => value !== EMPTY_TILE);

// Return true if the current tetrimino can't be placed or any tile in the top row has been filled
export const isGameOver = (grid: Grid, currentTetrimino: Tetrimino) =>
  grid[0].some((tile) => tile !== EMPTY_TILE) ||
  !isValidLocation(0, 0, grid, currentTetrimino);

// Get the row that a tetrimino at some position will be dropped on
export const getFloorRow = (
  rowOffset: number,
  colOffset: number,
  grid: Grid,
  tetrimino: Tetrimino
) => {
  while (isValidLocation(rowOffset, colOffset, grid, tetrimino)) {
    rowOffset++;
  }

  return rowOffset - 1;
};

export const hasCoord = (
  rowToCheck: number,
  colToCheck: number,
  coords: Coord[]
) => coords.some(([row, col]) => row === rowToCheck && col === colToCheck);

// Return the number of tiles in the grid that aren't empty
export const getFilledTileCount = (grid: Grid) => {
  return grid.reduce(
    (total: number, row: number[]) =>
      total +
      row.reduce(
        (total: number, tile: number) => total + (tile !== EMPTY_TILE ? 1 : 0),
        0
      ),
    0
  );
};

// For every row, check if it's full and clear it if needed
export const clearFilledLines = (gridArg: Grid) => {
  const grid = deepCopy(gridArg);

  for (let row = 0; row < GAME_HEIGHT; row++) {
    if (isFullRow(grid[row])) {
      clearRow(grid, row);
    }
  }

  return grid;
};

// Remove the row from the grid and add an empty row on top, simulating a clear
const clearRow = (grid: Grid, row: number) => {
  grid.splice(row, 1);
  grid.unshift(generateEmptyRow(GAME_WIDTH));
};

// Format a tetrimino to display in the preview grid
export const mapTetriminoToPreviewGrid = (tetrimino: Tetrimino) => {
  return mapTetriminoToGrid(
    tetrimino.coords(),
    tetrimino.getID(),
    generateEmptyGrid(PREVIEW_SIZE, PREVIEW_SIZE)
  );
};

// Take a tetrimino and add it into the grid data structure
export const mapTetriminoToMainGrid = (
  rowOffset: number,
  colOffset: number,
  grid: Grid,
  currentTetrimino: Tetrimino
) => {
  return mapTetriminoToGrid(
    currentTetrimino
      .coords()
      .map(([row, col]) => [row + rowOffset, col + colOffset]),
    currentTetrimino.getID(),
    deepCopy(grid)
  );
};

// Generic function for mapping tetriminos onto grids
const mapTetriminoToGrid = (
  tetriminoCoords: Coord[],
  id: number,
  grid: Grid
) => {
  tetriminoCoords.forEach(([rowOffset, colOffset]) => {
    grid[rowOffset][colOffset] = id;
  });

  return grid;
};
