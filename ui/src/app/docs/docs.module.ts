import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocsRoutingModule } from './docs-routing.module';
import { DocsComponent } from './components/docs/docs.component';
import { SharedModule } from '../shared/shared.module';
import { UsesNgMaterialModule } from '../uses-ng-material/uses-ng-material.module';

import { DocsMainToolbarComponent } from './components/docs/docs-main-toolbar/docs-main-toolbar.component';

@NgModule({
  declarations: [DocsComponent, DocsMainToolbarComponent],
  imports: [
    CommonModule,
    SharedModule,
    UsesNgMaterialModule,
    DocsRoutingModule
  ]
})
export class DocsModule { }
