import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormsModule, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { Languages } from '../../models/language';
import { DataService } from '../../data.service';
import { Dictionary } from '../../models/dictionary';
import { Word } from '../../models/word';
import { WordPage } from '../../models/WordPage';
import { DictionaryIndex } from '../../models/Dictionary';
import { AlertingService } from '../../alerting.service';
import { EditWordComponent, EditWordModalComponent } from '../edit-word/edit-word.component';

export class Index {
  title: string;
  link: string;
}

@Component({
  selector: 'app-words-by-link',
  templateUrl: './words.empty.html'
})
export class WordsByLinkComponent implements OnInit, OnDestroy {

  private sub: Subscription;

  constructor(private route: ActivatedRoute,
    private router: Router) {

  }
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const dictionaryLink = params['link'];
      if (dictionaryLink === '' || dictionaryLink == null) {
        this.router.navigate(['dictionaries']);
      } else {
        const id = dictionaryLink.substring(dictionaryLink.lastIndexOf('/') + 1);
        this.router.navigate(['dictionary', id]);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html'
})

export class WordsComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  isInSearch: Boolean = false;
  isLoading: Boolean = false;
  errorMessage: string;
  id: number;
  dictionary: Dictionary;
  searchText: Observable<string>;
  selectedIndex: Observable<string>;
  index: DictionaryIndex;
  wordPage: WordPage;
  loadedLink: string;
  indexes: Array<string>;
  pageNumber = 0;

  selectedWord: Word = null;
  createWordLink: string;
  showCreateDialog: Boolean = false;

  Languages = Languages;

  public searchForm = this.fb.group({
    query: ['']
  });

  constructor(private route: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder,
    private alertService: AlertingService,
    private translate: TranslateService,
    private dictionaryService: DataService,
    private modalService: EditWordModalComponent) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.pageNumber = params['page'] || 1;
      if (this.dictionary == null) {
        this.getDictionary(d => {
          this.getWords(d.indexLink);
        });
      } else {
        this.getWords(this.dictionary.indexLink);
      }
    });

    this.searchText = this.route.queryParams
      .map(params => params['search'] || '');
    this.searchText.subscribe(
      (val) => {
        if (val != null && val !== '') {
          this.searchForm.controls.query.setValue(val);
          if (this.dictionary == null) {
            this.getDictionary(d => {
              this.doSearch();
            });
          } else {
            this.doSearch();
          }
        }
      });

    this.selectedIndex = this.route.queryParams
      .map(params => params['startWith'] || '');
    this.selectedIndex.subscribe(
      (val) => {
        if (val !== '') {
          this.getIndex(val);
        }
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getIndex(index: string) {
    this.isInSearch = false;
    this.isLoading = true;
    this.dictionaryService.getWordStartingWith(index, this.pageNumber)
      .subscribe(
      words => {
        this.wordPage = words;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.alertService.error(this.translate.instant('DICTIONARY.MESSAGES.LOADING_FAILURE'));
        this.errorMessage = <any>error;
      });
  }

  getDictionary(callback) {
    this.isLoading = true;
    this.dictionaryService.getDictionary(this.id)
      .subscribe(
      dict => {
        this.dictionary = dict;
        this.isLoading = false;
        this.createWordLink = dict.createWordLink;
        callback(dict);
      },
      error => {
        this.isLoading = false;
        this.alertService.error(this.translate.instant('DICTIONARY.MESSAGES.LOADING_FAILURE'));
        this.errorMessage = <any>error;
      });
  }

  getWords(link) {
    this.isInSearch = false;
    this.isLoading = true;
    this.dictionaryService.getWords(link, this.pageNumber)
      .subscribe(
      words => {
        this.wordPage = words;
        this.isLoading = false;
        this.loadedLink = link;
      },
      error => {
        this.isLoading = false;
        this.alertService.error(this.translate.instant('DICTIONARY.MESSAGES.WORDS_LOADING_FAILURE'));
        this.errorMessage = <any>error;
      });
  }

  goNext() {
    this.pageNumber++;
    this.navigateToPage();
  }
  goPrevious() {
    this.pageNumber--;
    this.navigateToPage();
  }

  gotoIndex(index: DictionaryIndex) {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'startWith': index.link },
    };
    this.router.navigate(['/dictionary', this.id], navigationExtras);
  }

  gotoSearch() {
    const query = this.searchForm.controls.query.value;

    if (query == null || query.length < 0) {
      return;
    }

    const navigationExtras: NavigationExtras = {
      queryParams: { 'search': query }
    };
    this.router.navigate(['/dictionary', this.id], navigationExtras);
  }

  navigateToPage() {
    const startWith = this.route.snapshot.queryParams['startWith'];
    const search = this.route.snapshot.queryParams['search'];
    if (startWith != null && startWith !== '') {
      const navigationExtras: NavigationExtras = {
        queryParams: { 'startWith': startWith }
      };
      this.router.navigate(['dictionary', this.id, this.pageNumber], navigationExtras);
    } else if (search != null && search !== '') {
      const navigationExtras: NavigationExtras = {
        queryParams: { 'search': search }
      };
      this.router.navigate(['dictionary', this.id, this.pageNumber], navigationExtras);
    } else {
      this.router.navigate(['dictionary', this.id, this.pageNumber]);
    }
  }

  reloadPage() {
    this.getWords(this.loadedLink);
  }

  clearSearch() {
    this.searchForm.setValue({ query: '' });
    this.isInSearch = false;
    this.reloadPage();
  }

  doSearch() {
    const searchValue = this.searchForm.controls.query.value;
    if (searchValue != null && searchValue.length > 0) {
      this.isInSearch = true;
      this.isLoading = true;
      this.dictionaryService.searchWords(this.dictionary.searchLink, searchValue, this.pageNumber)
        .subscribe(words => {
          this.wordPage = words;
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          this.alertService.error(this.translate.instant('DICTIONARY.MESSAGES.SEARCH_LOADING_FAILURE'));
          this.errorMessage = <any>error;
        });
    }
  }

  addWord() {
    this.selectedWord = null;
    this.modalService.createNewWord(this.selectedWord, this.createWordLink, EditWordComponent, () => this.onCreateClosed());
  }

  editWord(word: Word) {
    this.selectedWord = word;
    this.modalService.editWord(this.selectedWord, EditWordComponent, () => this.onCreateClosed());
  }

  onCreateClosed() {
    this.selectedWord = null;
    this.reloadPage();
  }

  deleteWord(word: Word) {
    this.isLoading = true;
    this.dictionaryService.deleteWord(word.deleteLink)
      .subscribe(r => {
        this.alertService.success(this.translate.instant('WORD.MESSAGES.DELETE_SUCCESS', { title: word.title }));
        this.reloadPage();
      }, e => {
        this.errorMessage = <any>e;
        this.isLoading = false;
        this.alertService.error(this.translate.instant('WORD.MESSAGES.DELETE_FAILURE', { title: word.title }));
      });
  }
}
