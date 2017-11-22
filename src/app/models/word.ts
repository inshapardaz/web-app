import { Translation } from './Translation';
import { MeaningContext } from './MeaningContext';

export class Word {
    public id: Number;
    public title: String;
    public titleWithMovements: String;
    public pronunciation: String;
    public description: String;
    public attributes: String;
    public attributeValue: Number;
    public language: String;
    public languageId: Number;
    public translations: Translation[];
    public meaningContexts: MeaningContext[];
    public selfLink: String;
    public relationsLink: String;
    public updateLink: String;
    public deleteLink: String;
    public dictionaryLink: String;
    public addRelationLink: String;
    public translationsLink: String;
    public meaningsLink: String;
    public createMeaningLink: String;
    public createTranslationLink: String;
}
