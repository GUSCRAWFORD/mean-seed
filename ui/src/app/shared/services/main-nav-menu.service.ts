import { Injectable } from '@angular/core';
import { WithEvents, AppEvent } from './with-events';
export class MainNavMenuOptions {
  open:boolean = false;
};
export class MainNavMenuEvent extends AppEvent {
  constructor(
    public options:MainNavMenuOptions,
    public target:any,
    public native:any
  ) {
    super(target, native)
  }
}
@Injectable({
  providedIn: 'root'
})
export class MainNavMenuService extends WithEvents<MainNavMenuEvent> {

  constructor() {
    super();
    this.events.subscribe(
      mainNavMenuEvent=>this.options=mainNavMenuEvent.options
    )
  }
  options = new MainNavMenuOptions
}
