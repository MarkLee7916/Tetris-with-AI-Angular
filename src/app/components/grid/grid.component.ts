import { Component, Input } from '@angular/core';
import { Coord, Grid, hasCoord } from 'src/app/game';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent {
  @Input() grid!: Grid;
  @Input() tilesToHighlight!: Coord[];
  @Input() caption!: string;

  readonly colors = [
    '#001f3f',
    '#0074D9',
    '#7FDBFF',
    '#39CCCC',
    '#FF4136',
    '#FFDC00',
  ];

  isTileToHighlight(rowToCheck: number, colToCheck: number) {
    return hasCoord(rowToCheck, colToCheck, this.tilesToHighlight);
  }
}
