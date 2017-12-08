import { Languages } from '../../models/language';
import { Component } from '@angular/core';

import { AlertingService } from '../../alerting.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../data.service';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

import { Translation } from '../../models/translation';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-translation-modal-component',
  template: ``
})
export class EditTranslationModalComponent {
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  createNewTranslation(createLink: string, component: any, successCallback: () => any) {
    this.bsModalRef = this.modalService.show(component);
    this.bsModalRef.content.model = {};
    this.bsModalRef.content.createLink = createLink;
    this.bsModalRef.content.successCallback = successCallback;
  }

  editTranslation(model: any, component: any, successCallback: () => any) {
    this.bsModalRef = this.modalService.show(component);
    this.bsModalRef.content.model = Object.assign({}, model);
    this.bsModalRef.content.successCallback = successCallback;
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-translation',
  templateUrl: './edit-translation.component.html',
  styleUrls: ['./edit-translation.component.css']
})
export class EditTranslationComponent {
  model: Translation;
  languages: any[];
  languagesEnum = Languages;
  isBusy = false;
  createLink = null;
  successCallback: () => any;

  constructor(private dictionaryService: DataService,
    public translate: TranslateService,
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
    if (this.isCreating()) {
      this.dictionaryService.createWordTranslation(this.createLink, this.model)
        .subscribe(m => {
          this.isBusy = false;
          this.onClose();
          this.successCallback();
          this.alertService.success(this.translate.instant('WORDTRANSLATION.MESSAGES.CREATION_SUCCESS'));
        }, error => {
          this.isBusy = false;
          this.alertService.error(this.translate.instant('WORDTRANSLATION.MESSAGES.CREATION_FAILURE'));
        });
    } else {
      this.dictionaryService.updateWordTranslation(this.model.updateLink, this.model)
        .subscribe(m => {
          this.isBusy = false;
          this.onClose();
          this.successCallback();
          this.alertService.success(this.translate.instant('WORDTRANSLATION.MESSAGES.UPDATE_SUCCESS'));
        }, error => {
          this.isBusy = false;
          this.alertService.error(this.translate.instant('WORDTRANSLATION.MESSAGES.UPDATE_FAILURE'));
        });
    }
  }

  onClose() {
    this.bsModalRef.hide();
  }
}
