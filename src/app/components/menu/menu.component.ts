import { Component, Input, Output, EventEmitter } from '@angular/core';
import { getValueFromInputEvent } from 'src/app/utils';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  @Input() lineClears!: number;
  @Input() dropDelay!: number;
  @Input() lineClearCount!: number;
  @Input() isAIRunning!: boolean;

  @Output() dropDelayChange = new EventEmitter<number>();
  @Output() resetGameEmit = new EventEmitter();
  @Output() showTutorialEmit = new EventEmitter();
  @Output() toggleAIEmit = new EventEmitter();

  onInputChange(event: Event) {
    const newValue = parseInt(getValueFromInputEvent(event));

    this.dropDelayChange.emit(newValue);
  }

  onResetGame() {
    this.resetGameEmit.emit();
  }

  onShowTutorial() {
    this.showTutorialEmit.emit();
  }

  onToggleAI() {
    this.toggleAIEmit.emit();
  }
}
