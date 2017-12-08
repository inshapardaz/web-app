import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as _ from 'lodash';
import { environment } from '../environments/environment';

import { Mapper } from './mapper';
import { Dictionaries } from './models/dictionaries';
import { Dictionary } from './models/dictionary';
import { Link } from './models/link';
import { Word } from './models/word';
import { WordPage } from './models/wordPage';
import { Meaning } from './models/meaning';
import { Relation } from './models/relation';
import { Translation } from './models/translation';
import { Entry } from './models/entry';


@Injectable()
export class DataService {
  private static _entry: Entry;
  private serverAddress = '';
  private entryUrl = this.serverAddress + '/api';
  private indexUrl = this.serverAddress + '/api/dictionary/index';
  private dictionaryUrl = this.serverAddress + '/api/dictionaries/';
  private wordUrl = this.serverAddress + '/api/words/';
  private searchUrl = '/api/words/search/';
  private staringWithUrl = '/api/words/StartWith/';

  constructor(private auth: AuthenticationService,
    private http: Http) {
    const sessionOverride = environment.serverAddress;
    this.serverAddress = sessionOverride;
    this.entryUrl = this.serverAddress + '/api';
    this.indexUrl = this.serverAddress + '/api/dictionary/index';
    this.dictionaryUrl = this.serverAddress + '/api/dictionaries/';
    this.wordUrl = this.serverAddress + '/api/words/';
    this.searchUrl = '/api/words/search/';
    this.staringWithUrl = '/api/words/StartWith/';
  }

  getEntry(): Observable<Entry> {
    return this.auth.AuthGet(this.entryUrl)
      .map(r => {
        const e = this.extractData(r, Mapper.MapEntry);
        DataService._entry = e;
        return e;
      })
      .catch(this.handleError);
  }

  getDictionaries(link: string): Observable<Dictionaries> {
    return this.auth.AuthGet(link)
      .map(r => this.extractData(r, Mapper.MapDictionaries))
      .catch(this.handleError);
  }

  createDictionary(createLink: string, dictionary: Dictionary): Observable<Dictionary> {
    return this.auth.AuthPost(createLink, dictionary)
      .map(r => this.extractData(r, Mapper.MapDictionaries))
      .catch(this.handleError);
  }

  updateDictionary(updateLink: string, dictionary: Dictionary): Observable<void> {
    return this.auth.AuthPut(updateLink, dictionary)
      .catch(this.handleError);
  }

  deleteDictionary(deleteLink: string): Observable<void> {
    return this.auth.AuthDelete(deleteLink)
      .catch(this.handleError);
  }

  createDictionaryDownload(createDownloadLink: string): Observable<void> {
    return this.auth.AuthPost(createDownloadLink, {})
      .catch(this.handleError);
  }
  getDictionary(id: number): Observable<Dictionary> {
    return this.auth.AuthGet(this.dictionaryUrl + id)
      .map(r => this.extractData(r, Mapper.MapDictionary))
      .catch(this.handleError);
  }

  searchWords(url: string, query: string, pageNumber: number = 1, pageSize: number = 10): Observable<WordPage> {
    return this.auth.AuthGet(`${url}?query=${query}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
      .map(r => this.extractData(r, Mapper.MapWordPage))
      .catch(this.handleError);
  }

  getWords(url: string, pageNumber: number = 1, pageSize: number = 10): Observable<WordPage> {
    return this.auth.AuthGet(`${url}?pageNumber=${pageNumber}&pageSize=${pageSize}`)
      .map(r => this.extractData(r, Mapper.MapWordPage))
      .catch(this.handleError);
  }

  getWordById(dictionaryId, wordId): Observable<Word> {
    return this.auth.AuthGet(`${this.serverAddress}/api/dictionaries/${dictionaryId}/words/${wordId}`)
      .map(r => this.extractData(r, Mapper.MapWord))
      .catch(this.handleError);
  }

  getWord(url: string): Observable<Word> {
    return this.auth.AuthGet(url)
      .map(r => this.extractData(r, Mapper.MapWord))
      .catch(this.handleError);
  }

  createWord(createWordLink: string, word: Word): Observable<void> {
    return this.auth.AuthPost(createWordLink, word)
      .catch(this.handleError);
  }

  updateWord(updateLink: string, word: Word): Observable<void> {
    return this.auth.AuthPut(updateLink, word)
      .catch(this.handleError);
  }

  deleteWord(deleteLink: string): Observable<void> {
    return this.auth.AuthDelete(deleteLink)
      .catch(this.handleError);
  }

  searchWord(searchText: string, pageNumber: number = 1, pageSize: number = 10): Observable<WordPage> {
    return this.auth.AuthGet(`${this.searchUrl}${searchText}?pageNumber=${pageNumber}&pageSize=${pageSize}`)
      .map(r => this.extractData(r, Mapper.MapWordPage))
      .catch(this.handleError);
  }

  getSearchResults(url: string): Observable<WordPage> {
    return this.auth.AuthGet(url)
      .map(r => this.extractData(r, Mapper.MapWordPage))
      .catch(this.handleError);
  }

  wordStartingWith(startingWith: string, pageNumber: number = 1, pageSize: number = 10): Observable<WordPage> {
    return this.auth.AuthGet(`${this.staringWithUrl}${startingWith}?pageNumber=${pageNumber}&pageSize=${pageSize}`)
      .map(r => this.extractData(r, Mapper.MapWordPage))
      .catch(this.handleError);
  }

  getWordStartingWith(url: string, pageNumber: number = 1, pageSize: number = 10): Observable<WordPage> {
    return this.auth.AuthGet(`${url}?pageNumber=${pageNumber}&pageSize=${pageSize}`)
      .map(r => this.extractData(r, Mapper.MapWordPage))
      .catch(this.handleError);
  }

  getWordsStartingWith(url: string, startWith: string, pageNumber: number = 1, pageSize: number = 10): Observable<Word[]> {
    return this.auth.AuthGet(`${url}/words/startWith/${startWith}?pageNumber=${pageNumber}&pageSize=${pageSize}`)
      .map(r => this.extractData(r, Mapper.MapWordPage).words)
      .catch(this.handleError);
  }

  getWordRelations(url: string): Observable<Array<Relation>> {
    return this.auth.AuthGet(url)
      .map(r => this.extractData(r, Mapper.MapRelations))
      .catch(this.handleError);
  }

  getWordTranslations(url: string): Observable<Array<Translation>> {
    return this.auth.AuthGet(url)
      .map(r => this.extractData(r, Mapper.MapTranslations))
      .catch(this.handleError);
  }

  createWordTranslation(url: string, translation: Translation): Observable<Translation> {
    return this.auth.AuthPost(url, translation)
      .catch(this.handleError);
  }

  updateWordTranslation(url: string, translation: Translation): Observable<Translation> {
    return this.auth.AuthPut(url, translation)
      .catch(this.handleError);
  }

  deleteWordTranslation(deleteLink: string): Observable<void> {
    return this.auth.AuthDelete(deleteLink)
      .catch(this.handleError);
  }


  getMeanings(url: string): Observable<Array<Meaning>> {
    return this.auth.AuthGet(url)
      .map(r => this.extractData(r, Mapper.MapMeanings))
      .catch(this.handleError);
  }

  createMeaning(url: string, meaning: Meaning): Observable<Meaning> {
    return this.auth.AuthPost(url, meaning)
      .catch(this.handleError);
  }

  updateMeaning(url: string, meaning: Meaning): Observable<Meaning> {
    return this.auth.AuthPut(url, meaning)
      .catch(this.handleError);
  }

  deleteMeaning(deleteLink: string): Observable<void> {
    return this.auth.AuthDelete(deleteLink)
      .catch(this.handleError);
  }

  createRelation(url: string, relation: Relation): Observable<Relation> {
    return this.auth.AuthPost(url, relation)
      .catch(this.handleError);
  }

  updateRelation(url: string, relation: Relation): Observable<Relation> {
    return this.auth.AuthPut(url, relation)
      .catch(this.handleError);
  }

  deleteRelation(deleteLink: string): Observable<void> {
    return this.auth.AuthDelete(deleteLink)
      .catch(this.handleError);
  }

  private extractData(res: Response, converter: Function) {
    const body = res.json();
    return converter(body);
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    if (error.stack) {
        console.error(error.stack);
    }
    return Observable.throw(errMsg);
  }
}
