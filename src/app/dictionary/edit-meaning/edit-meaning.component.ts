import { AlertingService } from '../../alerting.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../data.service';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

import { Meaning } from '../../models/meaning';
import { Languages } from '../../models/language';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-meaning-modal-component',
  template: ``
})
export class EditMeaningModalComponent {
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  createNewMeaning(model: any, createLink: string, component: any, successCallback: () => any) {
    this.bsModalRef = this.modalService.show(component);
    this.bsModalRef.content.model = Object.assign({}, model);
    this.bsModalRef.content.createLink = createLink;
    this.bsModalRef.content.successCallback = successCallback;
  }

  editMeaning(model: any, component: any, successCallback: () => any) {
    this.bsModalRef = this.modalService.show(component);
    this.bsModalRef.content.model = Object.assign({}, model);
    this.bsModalRef.content.successCallback = successCallback;
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-meaning',
  templateUrl: './edit-meaning.component.html',
  styleUrls: ['./edit-meaning.component.css']
})
export class EditMeaningComponent {
  model: Meaning;
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
          this.dictionaryService.createMeaning(this.createLink, this.model)
          .subscribe(m => {
              this.isBusy = false;
              this.onClose();
              this.successCallback();
              this.alertService.success(this.translate.instant('MEANING.MESSAGES.CREATION_SUCCESS'));
          }, error => {
              this.isBusy = false;
              this.alertService.error(this.translate.instant('MEANING.MESSAGES.CREATION_FAILURE'));
          });
      } else {
          this.dictionaryService.updateMeaning(this.model.updateLink, this.model)
          .subscribe(m => {
              this.isBusy = false;
              this.onClose();
              this.successCallback();
              this.alertService.success(this.translate.instant('MEANING.MESSAGES.UPDATE_SUCCESS'));
          }, error => {
              this.isBusy = false;
              this.alertService.error(this.translate.instant('MEANING.MESSAGES.UPDATE_FAILURE'));
          });
      }
  }

  onClose() {
    this.bsModalRef.hide();
  }
}
