import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormsModule , FormBuilder } from '@angular/forms';

import { DictionaryService } from '../../../services/dictionary.service';
import { Dictionary } from '../../../models/dictionary';
import { WordPage } from '../../../models/WordPage';

@Component({
    selector: 'dictionary',
    templateUrl: './dictionary.component.html'
})

export class DictionaryComponent {
    private sub: Subscription;
    isInSearch : boolean = false;
    isLoading : boolean = false;
    errorMessage: string;
    id : number;
    dictionary : Dictionary;
    searchText : string;
    wordPage : WordPage;
    private loadedLink : string;

    public searchForm = this.fb.group({
        query: [""]
    });

    constructor(private route: ActivatedRoute,
        private router: Router,
        public fb: FormBuilder,
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
                this.getWords(this.dictionary.indexLink);
            },
            error => {
                this.errorMessage = <any>error;
            });
    }
    
    getWords(link){
        this.isInSearch = false;
        this.isLoading = true;
        this.dictionaryService.getWords(link)
            .subscribe(
                words => {
                    this.wordPage = words;
                    this.isLoading = false;
                    this.loadedLink = link;
                },
                error => {
                this.errorMessage = <any>error;
            });
    }

    loadPage(link){
        this.getWords(link);
    }
    clearSearch(){
        this.searchForm.setValue({ query : ''});
        this.getWords(this.loadedLink);
    }

    doSearch() {
        var searchValue = this.searchForm.controls.query.value;
        if(searchValue != null && searchValue.length > 0){
              this.isInSearch = true;
              this.isLoading = true; 
              this.dictionaryService.searchWords(this.dictionary.searchLink, searchValue)
              .subscribe(
                words => {
                    this.wordPage = words;
                    this.isLoading = false;
                },
                error => {
                this.errorMessage = <any>error;
            });
        }
    }

    handlerError(error : any) {
        this.errorMessage = <any>error;
        this.isLoading = false;
    }
}
