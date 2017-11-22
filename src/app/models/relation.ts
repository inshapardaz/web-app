import {RelationTypes} from './relationTypes';
export class Relation {
    public id: Number;
    public relatedWord: String;
    public relatedWordId: Number;
    public sourceWord: String;
    public sourceWordId: number;
    public relationType: String;
    public relationTypeId: RelationTypes;
    public relatedWordLink: String;
    public selfLink: String;
    public updateLink: String;
    public deleteLink: String;
}
