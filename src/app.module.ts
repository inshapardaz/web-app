import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AUTH_PROVIDERS } from 'angular2-jwt';

import { Auth } from './services/auth.service';

import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';
import { HeaderComponent } from './app/header/header.component';
import { FooterComponent } from './app/footer/footer.component';
import { DictionaryComponent } from './app/dictionary/dictionary.component';
import { routing  } from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpModule,
    JsonpModule,
  ],
  providers: [
    HttpModule,
    AUTH_PROVIDERS,
    Auth
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DictionaryComponent
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }   