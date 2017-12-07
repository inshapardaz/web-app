import { Component, Input, transition } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AlertingService } from '../../alerting.service';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../data.service';
import { Translation } from '../../models/translation';
import { RelationTypes } from '../../models/relationTypes';
import { EditTranslationComponent, EditTranslationModalComponent } from '../edit-translation/edit-translation.component';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'word-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.css']
})
export class TranslationsComponent {
  public _translationsLink: string;
  public relationTypes: RelationTypes;
  public isLoading: Boolean = false;
  public errorMessage: string;
  public translations: Array<Translation>;

  selectedTranslation: Translation;

  @Input() createLink: string;
  @Input() wordId: string;
  @Input()
  set translationsLink(translationLink: string) {
      this._translationsLink = (translationLink) || '';
      this.getTranslations();
  }
  get translationsLink(): string { return this._translationsLink; }

  constructor(private route: ActivatedRoute,
      private router: Router,
      private alertService: AlertingService,
      private translate: TranslateService,
      private dictionaryService: DataService,
      private modalService: EditTranslationModalComponent) {
  }

  getTranslations() {
      this.isLoading = true;
      this.dictionaryService.getWordTranslations(this._translationsLink)
          .subscribe(
          translations => {
              this.translations = translations;
              this.isLoading = false;
          },
          error => {
              this.errorMessage = <any>error;
              this.isLoading = false;
              this.alertService.error(this.translate.instant('WORDTRANSLATION.MESSAGES.LOAD_FAILURE'));
          });
  }

  addTranslation() {
      this.selectedTranslation = null;
      this.modalService.createNewTranslation(this.createLink, EditTranslationComponent, () => this.getTranslations());
  }

  editTranslation(translation: Translation) {
      this.selectedTranslation = translation;
      this.modalService.editTranslation(this.selectedTranslation, EditTranslationComponent, () => this.getTranslations());
  }

  deleteTranslation(translation: Translation) {
      this.dictionaryService.deleteWordTranslation(translation.deleteLink)
      .subscribe(r => {
          this.alertService.success(this.translate.instant('WORDTRANSLATION.MESSAGES.DELETE_SUCCESS'));
          this.getTranslations();
      }, error => {
          this.errorMessage = <any>error;
          this.isLoading = false;
          this.alertService.error(this.translate.instant('WORDTRANSLATION.MESSAGES.DELETE_FAILURE'));
      });
  }
}
