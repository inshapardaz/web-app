import { Word } from './word';

export class WordPage {
    public currentPageIndex: Number;
    public pageSize: Number;
    public pageCount: number;
    public words: Word[];
    public selfLink: String;
    public nextLink: String;
    public prevLink: String;
}
