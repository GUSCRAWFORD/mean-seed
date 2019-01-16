import { Component, OnInit, ViewChild } from '@angular/core';
import { UiService } from 'src/app/shared/services/ui.service';
import { MatDrawer } from '@angular/material';
import { MainNavMenuEvent, MainNavMenuOptions } from 'src/app/shared/services/main-nav-menu.service';

@Component({
  selector: 'app-main-nav-menu',
  templateUrl: './main-nav-menu.component.html',
  styleUrls: ['./main-nav-menu.component.scss']
})
export class MainNavMenuComponent implements OnInit {

  constructor(public ui:UiService) { }
  @ViewChild('drawer')drawer:MatDrawer;
  last:MainNavMenuOptions = this.ui.mainNavMenu.options;
  ngOnInit() {
    this.ui.mainNavMenu.events.subscribe(
      mainNavMenuEvent=>{
        if (this.ui.mainNavMenu.options.open!==this.last.open)
          this.drawer.toggle();
        this.last = mainNavMenuEvent.options;
      }
    )
  }

}
