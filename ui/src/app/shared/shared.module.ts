import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainToolbarComponent } from './components/layout/main-toolbar/main-toolbar.component';
import { UsesNgMaterialModule } from '../uses-ng-material/uses-ng-material.module';
import { MainNavMenuComponent } from './components/layout/main-nav-menu/main-nav-menu.component';

@NgModule({
  declarations: [
    MainToolbarComponent,
    MainNavMenuComponent
  ],
  imports: [
    CommonModule,
    UsesNgMaterialModule
  ],
  exports:[
    MainToolbarComponent,
    MainNavMenuComponent
  ]
})
export class SharedModule { }
