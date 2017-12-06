import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../data.service';
import { AlertingService } from '../../alerting.service';

import { Dictionary } from '../../models/dictionary';
import { Languages } from '../../models/language';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-dictionary-modal-component',
  template: ``
})
export class EditDictionaryModalComponent {
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}

  createNewDictionary(model: any, createLink: string, component: any, successCallback: () => any) {
    this.bsModalRef = this.modalService.show(component);
    this.bsModalRef.content.model = Object.assign({}, model);
    this.bsModalRef.content.createLink = createLink;
    this.bsModalRef.content.successCallback = successCallback;
  }

  editDictionary(model: any, component: any, successCallback: () => any) {
    this.bsModalRef = this.modalService.show(component);
    this.bsModalRef.content.model = Object.assign({}, model);
    this.bsModalRef.content.successCallback = successCallback;
  }
}

@Component({
  selector: 'app-edit-dictionary',
  templateUrl: './edit-dictionary.component.html',
  styleUrls: ['./edit-dictionary.component.css']
})

export class EditDictionaryComponent {
  model: Dictionary;
  languages: any[];
  languagesEnum = Languages;
  isBusy: Boolean = false;
  createLink: string = null;
  successCallback: () => any;

  constructor(
    private dictionaryService: DataService,
    private translate: TranslateService,
    private alertService: AlertingService,
    public bsModalRef: BsModalRef) {
      this.languages = Object.keys(this.languagesEnum).filter(Number);
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
      this.dictionaryService.createDictionary(this.createLink, this.model)
        .subscribe(m => {
          this.isBusy = false;
          this.successCallback();
          this.alertService.success(this.translate.instant('DICTIONARIES.MESSAGES.CREATION_SUCCESS', { name: this.model.name }));
        }, e => {
          this.isBusy = false;
          this.alertService.error(this.translate.instant('DICTIONARIES.MESSAGES.CREATION_FAILURE', { name: this.model.name }));
        });
    } else {
      this.dictionaryService.updateDictionary(this.model.updateLink, this.model)
        .subscribe(m => {
          this.isBusy = false;
          this.successCallback();
          this.bsModalRef.hide();
          this.alertService.success(this.translate.instant('DICTIONARIES.MESSAGES.UPDATE_SUCCESS', { name: this.model.name }));
        }, e => {
          this.isBusy = false;
          this.alertService.error(this.translate.instant('DICTIONARIES.MESSAGES.UPDATE_FAILURE', { name: this.model.name }));
        });
    }
  }

  onClose() {
    this.bsModalRef.hide();
  }
}
