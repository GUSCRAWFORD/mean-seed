import { Injectable, EventEmitter } from '@angular/core';
import { MainNavMenuService } from './main-nav-menu.service';
import { AppEvent, WithEvents } from './with-events';
export class UiEvent extends AppEvent {
  constructor(
    public target:any,
    public native:any
  ) {
    super(target, native);
  }
}
console.info(UiEvent)
@Injectable({
  providedIn: 'root'
})
export class UiService extends WithEvents<UiEvent> {

  constructor( public mainNavMenu:MainNavMenuService) {
    super();
  }
  
}
