import {RelationTypes} from './relationTypes';
export class Relation {
    public id: Number;
    public relatedWord: string;
    public relatedWordId: Number;
    public sourceWord: string;
    public sourceWordId: number;
    public relationType: string;
    public relationTypeId: RelationTypes;
    public relatedWordLink: string;
    public selfLink: string;
    public updateLink: string;
    public deleteLink: string;
}
