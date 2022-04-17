import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-controls',
  templateUrl: './mobile-controls.component.html',
  styleUrls: ['./mobile-controls.component.css'],
})
export class MobileControlsComponent {
  @Output() holdEmit = new EventEmitter();
  @Output() dropEmit = new EventEmitter();
  @Output() rotateEmit = new EventEmitter();
  @Output() shiftLeftEmit = new EventEmitter();
  @Output() shiftRightEmit = new EventEmitter();
  @Output() shiftDownEmit = new EventEmitter();

  onHold() {
    this.holdEmit.emit();
  }

  onDrop() {
    this.dropEmit.emit();
  }

  onRotate() {
    this.rotateEmit.emit();
  }

  onShiftLeft() {
    this.shiftLeftEmit.emit();
  }

  onShiftRight() {
    this.shiftRightEmit.emit();
  }

  onShiftDown() {
    this.shiftDownEmit.emit();
  }
}
