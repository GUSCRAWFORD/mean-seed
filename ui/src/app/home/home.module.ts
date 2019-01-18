import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { UsesNgMaterialModule } from '../uses-ng-material/uses-ng-material.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './components/home/home.component';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { LinksComponent } from './components/links/links.component';

@NgModule({
  declarations: [HomeComponent, TermsComponent, PrivacyComponent, LinksComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    UsesNgMaterialModule,
    SharedModule
  ]
})
export class HomeModule { }
