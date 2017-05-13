import {Languages} from './language';

export class Dictionary{
    public id : number;
    public selfLink : string;
    public name : string;
    public language : Languages;
    public isPublic : boolean;
    public wordCount : number;
    public searchLink : string;
    public indexLink : string;
}