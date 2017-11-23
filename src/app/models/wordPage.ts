import { Word } from './word';

export class WordPage {
    public currentPageIndex: Number;
    public pageSize: Number;
    public pageCount: number;
    public words: Word[];
    public selfLink: string;
    public nextLink: string;
    public prevLink: string;
}
