import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocsRoutingModule } from './docs-routing.module';
import { DocsComponent } from './components/docs/docs.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DocsComponent],
  imports: [
    CommonModule,
    SharedModule,
    DocsRoutingModule
  ]
})
export class DocsModule { }
