import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { AlertingService } from '../../alerting.service';
import { DataService } from '../../data.service';
import { Relation } from '../../models/relation';
import { Word } from '../../models/Word';
import { RelationTypes } from '../../models/relationTypes';
import { EditRelationshipTranslationComponent, EditRelationshipComponent } from '../edit-relationship/edit-relationship.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'word-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css']
})

export class RelationsComponent {
  public _relationsLink: string;

  public relationTypes: RelationTypes;
  public isLoading: Boolean = false;
  public errorMessage: string;
  public relations: Array<Relation>;
  selectedRelation: Relation = null;
  showEditDialog: Boolean = false;

  @Input() createRelationLink: string;
  @Input() dictionaryLink: string;
  @Input() dictionaryId: string;
  @Input() sourceWord: Word;
  @Input()
  set relationsLink(relationsLink: string) {
      this._relationsLink = (relationsLink) || '';
      this.getRelations();
  }
  get relationsLink(): string { return this._relationsLink; }

  constructor(private route: ActivatedRoute,
      private router: Router,
      private alertService: AlertingService,
      private translate: TranslateService,
      private dictionaryService: DataService,
      private modalService: EditRelationshipTranslationComponent) {
  }

  getRelations() {
      this.isLoading = true;
      this.dictionaryService.getWordRelations(this._relationsLink)
          .subscribe(
          relations => {
              this.relations = relations;
              this.isLoading = false;
          },
          error => {
              this.alertService.error(this.translate.instant('RELATION.MESSAGES.LOAD_FAILURE'));
              this.errorMessage = <any>error;
          });
  }

  addRelation() {
      this.modalService.createNewRelationship(this.createRelationLink, this.dictionaryLink,
        this.sourceWord, EditRelationshipComponent, () => this.getRelations());
  }

  editRelation(relation: Relation) {
      this.selectedRelation = relation;
      this.modalService.editRelationship(this.selectedRelation, this.dictionaryLink,
        this.sourceWord, EditRelationshipComponent, () => this.getRelations());
  }

  deleteRelation(relation: Relation) {
      this.dictionaryService.deleteRelation(relation.deleteLink)
      .subscribe(r => {
          this.alertService.success(this.translate.instant('RELATION.MESSAGES.DELETE_SUCCESS'));
          this.getRelations();
      }, error => {
          this.errorMessage = <any>error;
          this.alertService.error(this.translate.instant('RELATION.MESSAGES.DELETE_FAILURE'));
      });
  }
}
