import { EventEmitter } from '@angular/core';
export class AppEvent {
  constructor(
    public target:any,
    public native:any
  ) {
  }
}
export class WithEvents<E extends AppEvent> {

  constructor() {
  }

  events = new EventEmitter<E>();
  
}
