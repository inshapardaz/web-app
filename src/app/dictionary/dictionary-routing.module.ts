import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { WordsComponent, WordsByLinkComponent } from './words/words.component';
import { WordComponent } from './word/word.component';

const routes: Routes = [
  { path: 'dictionaries',              component: HomeComponent },
  { path: 'dictionaries/home',         component: HomeComponent },
  { path: 'dictionaryLink/:link',      component: WordsByLinkComponent},
  { path: 'dictionary/:id',            component: WordsComponent},
  { path: 'dictionary/:id/:page',      component: WordsComponent},
  { path: 'word/:id/:wordId',          component: WordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DictionaryRoutingModule { }
