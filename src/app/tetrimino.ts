import { Coord } from './game';
import { getRandomBlock } from './tetriminoTypes';
import { randomIntBetween } from './utils';

// The number of possible rotations a tetrimino could be in
const ROTATION_TYPES = 4;

// The number of tiles in a tetrimino
export const TILE_COUNT = 4;

export class Tetrimino {
  // Represents shape of tetrimino, complete will all rotations
  private readonly dimensions: Coord[][];

  // Which rotation we're on
  private rotationIndex: number;

  // Allows us consistently act on the same block (i.e keeping block the same colour)
  private readonly ID;

  constructor(dimensions?: Coord[][], rotationIndex?: number, ID?: number) {
    this.dimensions = dimensions ?? getRandomBlock();
    this.rotationIndex = rotationIndex ?? randomIntBetween(0, ROTATION_TYPES);
    this.ID = ID ?? randomIntBetween(0, ROTATION_TYPES * TILE_COUNT);
  }

  // Create a deep copy of current tetrimino and rotate it once
  public nextRotation() {
    const nextRotationIndex =
      this.rotationIndex === ROTATION_TYPES - 1 ? 0 : this.rotationIndex + 1;

    return new Tetrimino(this.dimensions, nextRotationIndex, this.ID);
  }

  public getID() {
    return this.ID;
  }

  // Return list of coordinates in tetrimino, where a coordinate is a row col pair
  public coords(): Coord[] {
    return this.dimensions[this.rotationIndex];
  }
}
