import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RestInfoComponent } from './components/rest-info/rest-info.component';
import { StringifyPipe } from './pipes/stringify.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RestInfoComponent,
    StringifyPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
