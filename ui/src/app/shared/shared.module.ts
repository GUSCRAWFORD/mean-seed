import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainToolbarComponent } from './components/layout/main-toolbar/main-toolbar.component';
import { UsesNgMaterialModule } from '../uses-ng-material/uses-ng-material.module';

@NgModule({
  declarations: [
    MainToolbarComponent
  ],
  imports: [
    CommonModule,
    UsesNgMaterialModule
  ],
  exports:[
    MainToolbarComponent
  ]
})
export class SharedModule { }
