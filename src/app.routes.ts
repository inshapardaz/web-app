import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent }      from './app/home/home.component';
import { DictionaryComponent }      from './app/dictionary/dictionary.component';

// import { SearchComponent }      from './components/search/search.component';

// import { DictionariesComponent } from './components/dictionary/dictionaries.component';
// import { DictionaryComponent }      from './components/dictionary/dictionary.component';
// import { DictionaryDetailComponent } from './components/dictionary/dictionaryDetail.Compontent';
// import { DictionaryOverviewComponent }      from './components/dictionary/overview.component';
// import { WordListComponent }      from './components/dictionary/wordList.component';
// import { WordComponent }      from './components/dictionary/word.component';

import { ThesaurusComponent }      from './app/thesaurus/thesaurus.component';
import { TranslationsComponent }      from './app/translations/translations.component';
// import { EditorComponent }      from './components/editor/editor.component';

// import {PageNotFoundComponent} from "./components/pages/notfound.component";

const appRoutes: Routes = [
    { path: '',            component: HomeComponent },
    { path: 'home',        component: HomeComponent },
    // { path: 'search/:searchText',      component: SearchComponent },
    // { path: 'search/:searchText/:pageNumber',      component: SearchComponent },
    // { path: 'dictionaries',        component: DictionariesComponent },
    // { path: 'dictionary/:id', component : DictionaryDetailComponent },
    { path: 'dictionaries',        component: DictionaryComponent},
    //   children: [
    //     { path: 'overview', component: DictionaryOverviewComponent },
    //     { path: 'words/:startWith', component: WordListComponent },        
    //     { path: 'words/:startWith/:pageNumber', component: WordListComponent },
    //     { path: 'word/:id', component: WordComponent }
    //   ]
    // },
    { path: 'thesaurus',     component: ThesaurusComponent },
    { path: 'translations',    component: TranslationsComponent },
    // { path: 'editor',        component: EditorComponent },
    // { path: '404',           component: PageNotFoundComponent},
    // { path: '**',            redirectTo: '/404', pathMatch: 'full' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);