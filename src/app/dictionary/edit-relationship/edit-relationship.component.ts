import { DomSanitizer } from '@angular/platform-browser';
import { Word } from '../../models/word';
import { RelationTypes } from '../../models/relationTypes';
import { Languages } from '../../models/language';
import { AlertingService } from '../../alerting.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../data.service';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Relation } from '../../models/relation';
import { Observable } from 'rxjs/Observable';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-relationship-modal-component',
  template: ``
})
export class EditRelationshipTranslationComponent {
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  createNewRelationship(createLink: string, dictionaryLink: string,
    sourceWord: Word, component: any, successCallback: () => any) {
    this.bsModalRef = this.modalService.show(component);
    this.bsModalRef.content.model = {};
    this.bsModalRef.content.createLink = createLink;
    this.bsModalRef.content.successCallback = successCallback;
    this.bsModalRef.content.dictionaryLink = dictionaryLink;
    this.bsModalRef.content.sourceWord = sourceWord;
  }

  editRelationship(model: any, dictionaryLink: string,
    sourceWord: Word, component: any, successCallback: () => any) {
    this.bsModalRef = this.modalService.show(component);
    this.bsModalRef.content.model = Object.assign({}, model);
    this.bsModalRef.content.successCallback = successCallback;
    this.bsModalRef.content.dictionaryLink = dictionaryLink;
    this.bsModalRef.content.sourceWord = sourceWord;
  }
}

@Component({
  selector: 'app-edit-relationship',
  templateUrl: './edit-relationship.component.html',
  styleUrls: ['./edit-relationship.component.css']
})
export class EditRelationshipComponent {
  model: Relation;
  sourceWord: Word;
  relationTypesValues: any[];
  relationTypesEnum = RelationTypes;

  isBusy: Boolean = false;
  createLink: string = null;
  dictionaryLink: string = null;
  successCallback: () => any;
  constructor(private dictionaryService: DataService,
    private translate: TranslateService,
    private alertService: AlertingService,
    public bsModalRef: BsModalRef,
    private _sanitizer: DomSanitizer) {
      this.relationTypesValues = Object.keys(this.relationTypesEnum).filter(Number);
  }

  observableSource = (keyword: any): Observable<Word[]> => {
    if (keyword) {
      return this.dictionaryService.getWordsStartingWith(this.dictionaryLink, keyword);
    } else {
      return Observable.of([]);
    }
  }
  autocompleteListFormatter = (data: any) => {
    return this._sanitizer.bypassSecurityTrustHtml(data.title);
  }

  relatedWordChanged(e: Word): void {
    this.model.relatedWordId = e.id;
    this.model.relatedWord = e.title;
  }

  isCreating(): boolean {
    return this.createLink !== null;
  }

  confirm() {
    if (this.isBusy) {
      return;
    }
    if (this.isCreating()) {
      this.model.sourceWord = this.sourceWord.title;
      this.dictionaryService.createRelation(this.createLink, this.model)
        .subscribe(m => {
          this.isBusy = false;
          this.onClose();
          this.successCallback();
          this.alertService.success(this.translate.instant('RELATION.MESSAGES.CREATION_SUCCESS'));
        }, error => {
          this.isBusy = false;
          this.alertService.error(this.translate.instant('RELATION.MESSAGES.CREATION_FAILURE'));
        });
    } else {
      this.dictionaryService.updateRelation(this.model.updateLink, this.model)
        .subscribe(m => {
          this.isBusy = false;
          this.onClose();
          this.successCallback();
          this.alertService.success(this.translate.instant('RELATION.MESSAGES.UPDATE_SUCCESS'));
        }, error => {
          this.isBusy = false;
          this.alertService.error(this.translate.instant('RELATION.MESSAGES.UPDATE_FAILURE'));
        });
    }
  }

  onClose() {
    this.bsModalRef.hide();
  }
}
