import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { SweetAlert2Module } from '@toverux/ngsweetalert2';

import { DictionaryRoutingModule } from './dictionary-routing.module';
import { HomeComponent } from './home/home.component';
import { EditDictionaryComponent } from './edit-dictionary/edit-dictionary.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DictionaryRoutingModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    Ng2AutoCompleteModule,
    SweetAlert2Module
  ],
  declarations: [
    HomeComponent,
    EditDictionaryComponent
  ]
})
export class DictionaryModule { }
