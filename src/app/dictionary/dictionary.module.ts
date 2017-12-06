import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { DictionaryRoutingModule } from './dictionary-routing.module';
import { HomeComponent } from './home/home.component';
import { EditDictionaryComponent, EditDictionaryModalComponent } from './edit-dictionary/edit-dictionary.component';
import { WordsComponent, WordsByLinkComponent } from './words/words.component';
import { RelationsComponent } from './relations/relations.component';
import { TranslationsComponent } from './translations/translations.component';
import { MeaningsComponent } from './meanings/meanings.component';
import { WordComponent } from './word/word.component';
import { BsModalService, BsModalRef, ModalBackdropComponent } from 'ngx-bootstrap';
import { EditWordComponent, EditWordModalComponent } from './edit-word/edit-word.component';

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
  providers: [
    EditDictionaryModalComponent,
    EditWordModalComponent,
    BsModalService,
    BsModalRef,
    ModalBackdropComponent
  ],
  declarations: [
    HomeComponent,
    EditDictionaryComponent,
    WordsComponent,
    WordsByLinkComponent,
    RelationsComponent,
    TranslationsComponent,
    MeaningsComponent,
    WordComponent,
    EditWordComponent
  ],
  entryComponents: [
    EditDictionaryComponent,
    EditWordComponent
  ]
})
export class DictionaryModule { }
