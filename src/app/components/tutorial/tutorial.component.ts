import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css'],
})
export class TutorialComponent {
  // Emitter for hiding the tutorial
  @Output() hideEmit = new EventEmitter();

  // Controls which modal slide is currently being displayed
  modalIndex: number = 0;

  nextModal() {
    this.modalIndex++;
  }

  prevModal() {
    this.modalIndex--;
  }

  onHide() {
    this.hideEmit.emit();
  }
}
