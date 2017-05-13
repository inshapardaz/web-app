import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder } from '@angular/forms';

import { DictionaryService } from '../../../services/dictionary.service';
import { Dictionary } from '../../../models/dictionary';
import { WordPage } from '../../../models/WordPage';

@Component({
    selector: 'dictionary',
    templateUrl: './dictionary.component.html'
})

export class DictionaryComponent {
    private sub: Subscription;
    isLoading : boolean = false;
    isLoadingWords : boolean = false;
    errorMessage: string;
    id : number;
    dictionary : Dictionary;
    searchText : string;
    wordPage : WordPage;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private dictionaryService: DictionaryService){
    }i
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.getDictionary();
        });
    }

    getDictionary() {
        this.isLoading = true;
        this.dictionaryService.getDictionary(this.id)
            .subscribe(
            dict => { 
                this.dictionary = dict;
                this.isLoading = false;
                this.getWords();
            },
            error => {
                this.errorMessage = <any>error;
            });
    }

    getWords(){
        this.isLoadingWords = true;
        this.dictionaryService.getWords(this.dictionary.indexLink)
            .subscribe(
                words => {
                    this.wordPage = words;
                    this.isLoadingWords = true;
                },
                error => {
                this.errorMessage = <any>error;
            });
    }

    doSearch() {
        if(this.searchText != null && this.searchText.length > 0){
              this.isLoadingWords = true; 
              this.dictionaryService.searchWords(this.dictionary.searchLink)
              .subscribe(
                words => {
                    this.wordPage = words;
                    this.isLoadingWords = true;
                },
                error => {
                this.errorMessage = <any>error;
            });
        }
    }

    handlerError(error : any) {
        this.errorMessage = <any>error;
        this.isLoading = false;
        this.isLoadingWords = true;
    }
}
