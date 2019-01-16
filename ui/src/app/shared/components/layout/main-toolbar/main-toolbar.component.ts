import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/shared/services/ui.service';
import { MainNavMenuEvent } from 'src/app/shared/services/main-nav-menu.service';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {

  constructor(public ui: UiService) { }

  ngOnInit() {
  }

  toggleMenu($event:any) {
    var currently = this.ui.mainNavMenu.options.open;
    console.info(`Toggling main nav-menu: (${!currently})`)
    this.ui.mainNavMenu.events.emit(new MainNavMenuEvent(
      {
        open:!currently
      },
      this,
      $event
    ))
  }
}
