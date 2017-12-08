import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../data.service';
import { AlertingService } from '../../alerting.service';

import { Word } from '../../models/word';
import { Languages } from '../../models/language';
import { GrammaticTypes } from '../../models/grammaticalTypes';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-word-modal-component',
  template: ``
})
export class EditWordModalComponent {
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  createNewWord(model: any, createLink: string, component: any, successCallback: () => any) {
    this.bsModalRef = this.modalService.show(component);
    this.bsModalRef.content.model = Object.assign({}, model);
    this.bsModalRef.content.createLink = createLink;
    this.bsModalRef.content.successCallback = successCallback;
  }

  editWord(model: any, component: any, successCallback: () => any) {
    this.bsModalRef = this.modalService.show(component);
    this.bsModalRef.content.model = Object.assign({}, model);
    this.bsModalRef.content.successCallback = successCallback;
  }
}

@Component({
  selector: 'app-edit-word',
  templateUrl: './edit-word.component.html',
  styleUrls: ['./edit-word.component.css']
})
export class EditWordComponent {
  model: Word;
  languages: any[];
  languagesEnum = Languages;
  attributesValues: any[];
  attributeEnum = GrammaticTypes;
  isBusy = false;
  createLink = null;
  successCallback: () => any;

  constructor(
    private dictionaryService: DataService,
    public translate: TranslateService,
    private alertService: AlertingService,
    public bsModalRef: BsModalRef) {
    this.languages = Object.keys(this.languagesEnum).filter(Number);
    this.attributesValues = Object.keys(this.attributeEnum).filter(Number);
  }

  isCreating(): boolean {
    return this.createLink !== null;
  }

  confirm() {
    if (this.isBusy) {
      return;
    }
    this.isBusy = true;
    if (this.isCreating()) {
      this.dictionaryService.createWord(this.createLink, this.model)
        .subscribe(m => {
          this.isBusy = false;
          this.bsModalRef.hide();
          this.successCallback();
          this.alertService.success(this.translate.instant('WORD.MESSAGES.CREATION_SUCCESS', { title: this.model.title }));
        }, e => {
          this.isBusy = false;
          this.alertService.error(this.translate.instant('WORD.MESSAGES.CREATION_FAILURE', { title: this.model.title }));

        });
    } else {
      this.dictionaryService.updateWord(this.model.updateLink, this.model)
        .subscribe(m => {
          this.isBusy = false;
          this.bsModalRef.hide();
          this.successCallback();
          this.alertService.success(this.translate.instant('WORD.MESSAGES.UPDATE_SUCCESS', { title: this.model.title }));
        }, e => {
          this.isBusy = false;
          this.alertService.error(this.translate.instant('WORD.MESSAGES.UPDATE_FAILURE', { title: this.model.title }));
        });
    }
  }

  onClose() {
    this.bsModalRef.hide();
  }

}
