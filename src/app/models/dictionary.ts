import {Languages} from './language';

export class Dictionary {
    public id: Number;
    public selfLink: String;
    public name: String;
    public language: Languages;
    public isPublic: Boolean;
    public wordCount: Number;
    public searchLink: String;
    public indexLink: String;
    public indexes: Array<DictionaryIndex>;
    public updateLink: String;
    public deleteLink: String;
    public createWordLink: String;
    public createDownloadLink: String;
}

export class DictionaryIndex {
    public title: String;
    public link: String;
}
