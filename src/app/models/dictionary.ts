import {Languages} from './language';

export class Dictionary {
    public id: Number;
    public selfLink: string;
    public name: string;
    public language: Languages;
    public isPublic: Boolean;
    public wordCount: Number;
    public searchLink: string;
    public indexLink: string;
    public indexes: Array<DictionaryIndex>;
    public updateLink: string;
    public deleteLink: string;
    public createWordLink: string;
    public createDownloadLink: string;
}

export class DictionaryIndex {
    public title: string;
    public link: string;
}
