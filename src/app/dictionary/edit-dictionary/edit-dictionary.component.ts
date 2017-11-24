import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { DataService } from '../../data.service';
import { AlertingService } from '../../alerting.service';

import { Dictionary } from '../../models/Dictionary';
import { Languages } from '../../models/language';

import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

import * as $ from 'jquery';

export interface EditDictionaryModel {
  model: Dictionary;
  languages: any[];
  isBusy: Boolean;
  isCreating: Boolean;
}

@Component({
  selector: 'app-edit-dictionary',
  templateUrl: './edit-dictionary.component.html',
  styleUrls: ['./edit-dictionary.component.css']
})

export class EditDictionaryComponent extends DialogComponent<EditDictionaryModel, boolean> implements EditDictionaryModel {
  model = new Dictionary();
  languages: any[];
  languagesEnum = Languages;
  _visible: Boolean = false;
  isBusy: Boolean = false;
  isCreating: Boolean = false;

  @Input() createLink = '';
  @Input() modalId = '';
  @Input() dictionary: Dictionary = null;
  @Output() onClosed = new EventEmitter<boolean>();

  @Input()
  set visible(isVisible: Boolean) {
    this._visible = isVisible;
    this.isBusy = false;
    if (isVisible) {
      if (this.dictionary == null) {
        this.model = new Dictionary();
        this.isCreating = true;
      } else {
        this.model = Object.assign({}, this.dictionary);
        this.isCreating = false;
      }
      // $('#' + this.modalId).modal('show');
    } else {
      // $('#' + this.modalId).modal('hide');
    }
  }

  get visible(): Boolean { return this._visible; }


  constructor(
    private dictionaryService: DataService,
    private router: Router,
    private translate: TranslateService,
    private alertService: AlertingService,
    dialogService: DialogService) {
      super(dialogService);
      this.languages = Object.keys(this.languagesEnum).filter(Number);
      this.model.language = Languages.Urdu;
  }

  confirm() {
    if (this.isBusy) {
      return;
    }

    this.isBusy = true;
    if (this.isCreating) {
      this.dictionaryService.createDictionary(this.createLink, this.model)
        .subscribe(m => {
          this.isBusy = false;
          this.onClosed.emit(true);
          this.visible = false;
          this.alertService.success(this.translate.instant('DICTIONARIES.MESSAGES.CREATION_SUCCESS', { name: this.model.name }));
        }, e => {
          this.isBusy = false;
          this.alertService.error(this.translate.instant('DICTIONARIES.MESSAGES.CREATION_FAILURE', { name: this.model.name }));
        });
    } else {
      this.dictionaryService.updateDictionary(this.model.updateLink, this.model)
        .subscribe(m => {
          this.isBusy = false;
          this.result = true;
          this.close();
          this.alertService.success(this.translate.instant('DICTIONARIES.MESSAGES.UPDATE_SUCCESS', { name: this.model.name }));
        }, e => {
          this.isBusy = false;
          this.alertService.error(this.translate.instant('DICTIONARIES.MESSAGES.UPDATE_FAILURE', { name: this.model.name }));
        });
    }
  }

  onClose() {
    this.onClosed.emit(false);
    this.visible = false;
  }
}
