import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AUTH_PROVIDERS } from 'angular2-jwt';

import { Auth } from './services/auth.service';
import { DictionaryService } from './services/dictionary.service';

import { UIToggleDirective } from './components/ui-toggle.component';
import { AppearDirective } from './components/appear.component';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';
import { HeaderComponent } from './app/header/header.component';
import { FooterComponent } from './app/footer/footer.component';
import { DictionariesComponent } from './app/dictionary/dictionaries/dictionaries.component';
import { DictionaryComponent } from './app/dictionary/dictionary/dictionary.component';
import { ThesaurusComponent }      from './app/thesaurus/thesaurus.component';
import { TranslationsComponent }      from './app/translations/translations.component';

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
    Auth,
    DictionaryService
  ],
  declarations: [
    UIToggleDirective,
    AppearDirective,

    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DictionariesComponent,
    DictionaryComponent,
    ThesaurusComponent,
    TranslationsComponent
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }   