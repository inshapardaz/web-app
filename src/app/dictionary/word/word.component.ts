import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormsModule , FormBuilder } from '@angular/forms';

import { DataService } from '../../data.service';
import { Word } from '../../models/Word';
import { AlertingService } from '../../alerting.service';
import { TranslateService } from '@ngx-translate/core';
import { EditWordComponent, EditWordModalComponent } from '../edit-word/edit-word.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  isBusy: Boolean = false;
  showEditDialog: Boolean = false;
  errorMessage: string;
  dictionaryId: number;
  wordId: number;
  word: Word;

  constructor(private route: ActivatedRoute,
      private router: Router,
      private alertService: AlertingService,
      private translate: TranslateService,
      private dictionaryService: DataService,
      private modalService: EditWordModalComponent) {
  }

  ngOnInit() {
      this.sub = this.route.params.subscribe(params => {
          this.dictionaryId = params['id'];
          this.wordId = params['wordId'];
          this.getWord();
      });
  }

  ngOnDestroy() {
      this.sub.unsubscribe();
  }

  getWord() {
      this.isBusy = true;
      this.dictionaryService.getWordById(this.dictionaryId, this.wordId)
          .subscribe(
          word => {
              this.word = word;
              this.isBusy = false;
          },
          error => {
              this.isBusy = false;
              this.alertService.error(this.translate.instant('WORD.MESSAGES.LOAD_FAILURE'));
              this.errorMessage = <any>error;
          });
  }

  editWord() {
      this.modalService.editWord(this.word, EditWordComponent, () => this.getWord());
  }

  deleteWord() {
      this.isBusy = true;
      this.dictionaryService.deleteWord(this.word.deleteLink)
      .subscribe(r => {
          this.isBusy = false;
          this.alertService.success(this.translate.instant('WORD.MESSAGES.DELETE_SUCCESS', { title : this.word.title }));
          this.router.navigate(['dictionaryLink', this.word.dictionaryLink]);
      }, error => {
          this.errorMessage = <any>error;
          this.isBusy = false;
          this.alertService.error(this.translate.instant('WORD.MESSAGES.DELETE_FAILURE', { title : this.word.title}));
      });
  }
}
