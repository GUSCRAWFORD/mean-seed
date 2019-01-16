import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatMenuModule,
  MatSidenavModule,
  MatIconModule
} from '@angular/material';
import {
  ScrollDispatchModule
} from '@angular/cdk/scrolling';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,

    //CDK
    ScrollDispatchModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatIconModule,

    //CDK
    ScrollDispatchModule
  ],
})
export class UsesNgMaterialModule { }
