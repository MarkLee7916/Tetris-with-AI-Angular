import { Component, HostListener, OnInit } from '@angular/core';
import { computeOptimalMove } from 'src/app/ai';
import {
  clearFilledLines,
  Coord,
  GAME_HEIGHT,
  GAME_WIDTH,
  generateEmptyGrid,
  getFilledTileCount,
  getFloorRow,
  isGameOver,
  isValidLocation,
  mapTetriminoToMainGrid,
  mapTetriminoToPreviewGrid,
} from 'src/app/game';
import { Tetrimino } from 'src/app/tetrimino';
import { isTouchscreen, wait } from 'src/app/utils';

// Enum to encode different keys in the keyboard
const enum KeyCode {
  DownArrow = 'ArrowDown',
  RightArrow = 'ArrowRight',
  LeftArrow = 'ArrowLeft',
  UpArrow = 'ArrowUp',
  HKey = 'h',
  SpaceBar = ' ',
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  // Map a key onto the action that results from pressing it
  readonly keyToAction = new Map<string, () => void>([
    [KeyCode.DownArrow, () => this.shiftCurrentTetriminoDown()],
    [KeyCode.LeftArrow, () => this.shiftCurrentTetriminoLeft()],
    [KeyCode.RightArrow, () => this.shiftCurrentTetriminoRight()],
    [KeyCode.UpArrow, () => this.rotateCurrentTetrimino()],
    [KeyCode.HKey, () => this.swapWithHoldingTetrimino()],
    [KeyCode.SpaceBar, () => this.floorCurrentTetrimino()],
  ]);

  // The state of the main grid, not including the current falling tetrimino
  grid = generateEmptyGrid(GAME_HEIGHT, GAME_WIDTH);

  // The tetrimino the user has stored in their "hold block" cache
  holdingTetrimino = new Tetrimino();

  // The tetrimino that will become the current one after the current one has been placed
  nextTetrimino = new Tetrimino();

  // The tetrimino that is currently falling
  currentTetrimino = new Tetrimino();

  // Represents the position of the current tetrimino relative to the top left of the grid
  rowOffset = 0;
  colOffset = 0;

  // The delay time between each iteration of the current tetrimino falling
  dropDelay = 1000;

  // True if game has ended, otherwise false
  isGameOver = false;

  // The number of times player has cleared a line
  lineClearCount = 0;

  // True if tutorial is currently being displayed on screen, otherwise false
  isTutorialVisible = false;

  // True if AI is determining piece positions and rotations, otherwise false
  isAIRunning = true;

  // The caption that will appear above the main game grid
  mainGridCaption = '';

  // Assign function to instance variable so the HTML template can use it, hardcodes parameters
  readonly mapTetriminoToMainGrid = () =>
    mapTetriminoToMainGrid(
      this.rowOffset,
      this.colOffset,
      this.grid,
      this.currentTetrimino
    );

  // Assign function to instance variable so the HTML template can use it
  readonly mapTetriminoToPreviewGrid = mapTetriminoToPreviewGrid;

  // Assign variable to instance variable so the HTML template can use it
  readonly isTouchscreen = isTouchscreen;

  // When game initialises, run main game loop
  async ngOnInit() {
    while (!this.isGameOver) {
      await this.runTurn();
    }
  }

  // Run a single iteration of the game
  async runTurn() {
    if (this.isAIRunning) {
      this.runAI();
    }

    await this.dropCurrentTetrimino();
    this.saveTetriminoToGrid();
    this.handleLineClears();
    this.resetTurn();
    this.handleGameOver();
  }

  // Update grid with any line clears and update the line clear counter
  handleLineClears() {
    const newGrid = clearFilledLines(this.grid);

    this.lineClearCount +=
      (getFilledTileCount(this.grid) - getFilledTileCount(newGrid)) /
      GAME_WIDTH;

    this.grid = newGrid;
  }

  // Simulate the current tetrimino falling to the bottom of the grid
  async dropCurrentTetrimino() {
    if (this.dropDelay === 0) {
      await wait(0);
      this.floorCurrentTetrimino();
    } else {
      let oldRowOffset = -1;

      while (oldRowOffset !== this.rowOffset) {
        await wait(this.dropDelay);

        oldRowOffset = this.rowOffset;
        this.shiftRowOffsetBy(1);
      }
    }
  }

  shiftCurrentTetriminoDown() {
    this.shiftRowOffsetBy(1);
  }

  shiftCurrentTetriminoLeft() {
    this.shiftColOffsetBy(-1);
  }

  shiftCurrentTetriminoRight() {
    this.shiftColOffsetBy(1);
  }

  // Instantly move the current tetrimino to the bottom of the grid
  floorCurrentTetrimino() {
    this.rowOffset = getFloorRow(
      this.rowOffset,
      this.colOffset,
      this.grid,
      this.currentTetrimino
    );
  }

  // When current tetrimino has stopped moving, save its location onto the main grid
  saveTetriminoToGrid() {
    this.grid = this.mapTetriminoToMainGrid();
  }

  // Reset the current tetriminos position and update the current tetrimino
  resetTurn() {
    this.currentTetrimino = this.nextTetrimino;
    this.nextTetrimino = new Tetrimino();
    this.rowOffset = 0;
    this.colOffset = 0;
  }

  // If game is over, set game over flag to true and alert user
  handleGameOver() {
    if (isGameOver(this.grid, this.currentTetrimino)) {
      this.mainGridCaption = 'Game Over!';
      this.isGameOver = true;
    }
  }

  // Rotate tetrimino iff it doesn't collide or go out of bounds
  rotateCurrentTetrimino() {
    const rotatedTetrimino = this.currentTetrimino.nextRotation();

    if (
      isValidLocation(
        this.rowOffset,
        this.colOffset,
        this.grid,
        rotatedTetrimino
      )
    ) {
      this.currentTetrimino = rotatedTetrimino;
    }
  }

  // Swap the current tetrimino with the held one iff it doesn't collide or go out of bounds
  swapWithHoldingTetrimino() {
    if (
      isValidLocation(
        this.rowOffset,
        this.colOffset,
        this.grid,
        this.holdingTetrimino
      )
    ) {
      const temp = this.currentTetrimino;

      this.currentTetrimino = this.holdingTetrimino;
      this.holdingTetrimino = temp;
    }
  }

  // Listen for key presses and execute the corresponding action iff it exists
  @HostListener('window:keydown', ['$event'])
  handleUserKeyPress(event: KeyboardEvent) {
    const action = this.keyToAction.get(event.key);

    if (action !== undefined) {
      action();
    }
  }

  // Shift the piece either upwards or downwards iff it doesn't collide or go out of bounds
  shiftRowOffsetBy(offset: number) {
    const newRowOffset = this.rowOffset + offset;

    if (
      isValidLocation(
        newRowOffset,
        this.colOffset,
        this.grid,
        this.currentTetrimino
      )
    ) {
      this.rowOffset = newRowOffset;
    }
  }

  // Get the AI's choice of move and execute it
  runAI() {
    const { col, tetrimino, isHold } = computeOptimalMove(
      this.currentTetrimino,
      this.holdingTetrimino,
      this.grid
    );

    if (isHold) {
      this.swapWithHoldingTetrimino();
    }

    this.colOffset = col;
    this.currentTetrimino = tetrimino;
  }

  // Shift the piece either left or right iff it doesn't collide or go out of bounds
  shiftColOffsetBy(offset: number) {
    const newColOffset = this.colOffset + offset;

    if (
      isValidLocation(
        this.rowOffset,
        newColOffset,
        this.grid,
        this.currentTetrimino
      )
    ) {
      this.colOffset = newColOffset;
    }
  }

  // Return the list of coordinates that will highlight where a piece will drop
  getCoordsToHighlight(): Coord[] {
    return this.currentTetrimino
      .coords()
      .map(([row, col]) => [
        getFloorRow(
          this.rowOffset,
          this.colOffset,
          this.grid,
          this.currentTetrimino
        ) + row,
        col + this.colOffset,
      ]);
  }

  resetGame() {
    location.reload();
  }

  showTutorial() {
    this.isTutorialVisible = true;
  }

  hideTutorial() {
    this.isTutorialVisible = false;
  }

  toggleAI() {
    this.isAIRunning = !this.isAIRunning;
  }
}
