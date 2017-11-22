import * as _ from 'lodash';

import { Entry } from './models/entry';
import { Link } from './models/link';
import { Dictionaries } from './models/dictionaries';
import { Dictionary, DictionaryIndex } from './models/Dictionary';
import { Word } from './models/Word';
import { WordPage } from './models/wordPage';
import { Translation } from './models/Translation';
import { MeaningContext } from './models/MeaningContext';
import { Meaning } from './models/Meaning';
import { Relation } from './models/relation';
import { RelTypes } from './models/relTypes';

export class Mapper {
    public static MapEntry(source: any): Entry {
        const entry = new Entry();
        entry.selfLink = Mapper.findHrefWithRel(source.links, RelTypes.Self);
        entry.dictionariesLink = Mapper.findHrefWithRel(source.links, RelTypes.Dictionaries);
        entry.thesaurusLink = Mapper.findHrefWithRel(source.links, RelTypes.Thesaurus);
        entry.languagesLink = Mapper.findHrefWithRel(source.links, RelTypes.Languages);
        entry.attributesLink = Mapper.findHrefWithRel(source.links, RelTypes.Attributes);
        entry.relationshipTypesLink = Mapper.findHrefWithRel(source.links, RelTypes.RelationshipTypes);
        return entry;
    }

    public static MapDictionaries(source: any): Dictionaries {
        const dictionaries = new Dictionaries();
        dictionaries.selfLink = Mapper.findHrefWithRel(source.links, RelTypes.Self);
        dictionaries.createLink = Mapper.findHrefWithRel(source.links, RelTypes.Create);
        dictionaries.dictionaries = Mapper.MapDictionaryList(source.items);
        return dictionaries;
    }

    public static MapDictionaryList(source: any): Array<Dictionary> {
        const dictionariesCol = new Array<Dictionary>();
        _.forEach(source, (d) => dictionariesCol.push(Mapper.MapDictionary(d)));
         return dictionariesCol;
    }

    public static MapDictionary(source: any): Dictionary {
        const dictionary = new Dictionary();
        dictionary.id = source.id;
        dictionary.name = source.name;
        dictionary.isPublic = source.isPublic;
        dictionary.wordCount = source.wordCount;
        dictionary.language  = source.language;

        dictionary.selfLink = Mapper.findHrefWithRel(source.links, RelTypes.Self);
        dictionary.searchLink = Mapper.findHrefWithRel(source.links, RelTypes.Search);
        dictionary.indexLink = Mapper.findHrefWithRel(source.links, RelTypes.Index);
        dictionary.updateLink = Mapper.findHrefWithRel(source.links, RelTypes.Update);
        dictionary.deleteLink = Mapper.findHrefWithRel(source.links, RelTypes.Delete);
        dictionary.createWordLink = Mapper.findHrefWithRel(source.links, RelTypes.CreateWord);
        dictionary.createDownloadLink = Mapper.findHrefWithRel(source.links, RelTypes.CreateDownload);

        const indexes = new Array<DictionaryIndex>();
        _.forEach(source.indexes, (i) => indexes.push(Mapper.MapDictionaryIndex(i)));
        dictionary.indexes = indexes;

        return dictionary;
    }

    public static MapDictionaryIndex(sourceIndex: any): DictionaryIndex {
        const index = new DictionaryIndex();
        index.link = sourceIndex.href;
        index.title = sourceIndex.rel;
        return index;
    }

    public static MapWordPage(source: any): WordPage {
        const page = new WordPage();
        page.currentPageIndex = source.currentPageIndex;
        page.pageSize = source.pageSize;
        page.pageCount = source.pageCount;
        page.selfLink = Mapper.findHrefWithRel(source.links, RelTypes.Self);
        page.nextLink = Mapper.findHrefWithRel(source.links, RelTypes.Next);
        page.prevLink = Mapper.findHrefWithRel(source.links, RelTypes.Previous);
        page.words = Mapper.MapWords(source.data);
        return page;
    }

    public static MapWords(source: any): Word[] {
        const words = [];
        _.forEach(source, (v) => words.push(Mapper.MapWord(v)));
        return words;
    }

    public static MapWord(source: any): Word {
        const word = new Word();
        word.id = source.id;
        word.title = source.title;
        word.titleWithMovements = source.titleWithMovements;
        word.pronunciation = source.pronunciation;
        word.description = source.description;
        word.attributes = source.attributes;
        word.attributeValue = source.attributeValue;
        word.language = source.language;
        word.languageId = source.languageId;

        word.translations = Mapper.MapTranslations(source.translations);
        word.meaningContexts = Mapper.MapMeaningContexts(source.meanings);

        word.selfLink = Mapper.findHrefWithRel(source.links, RelTypes.Self);
        word.relationsLink = Mapper.findHrefWithRel(source.links, RelTypes.Relations);
        word.translationsLink = Mapper.findHrefWithRel(source.links, RelTypes.Translations);
        word.meaningsLink = Mapper.findHrefWithRel(source.links, RelTypes.Meanings);
        word.dictionaryLink = Mapper.findHrefWithRel(source.links, RelTypes.Dictionary);
        word.updateLink = Mapper.findHrefWithRel(source.links, RelTypes.Update);
        word.deleteLink = Mapper.findHrefWithRel(source.links, RelTypes.Delete);
        word.addRelationLink = Mapper.findHrefWithRel(source.links, RelTypes.AddRelation);
        word.createMeaningLink = Mapper.findHrefWithRel(source.links, RelTypes.AddMeaning);
        word.createTranslationLink = Mapper.findHrefWithRel(source.links, RelTypes.AddTranslation);
        return word;
    }

    public static MapTranslations(source: any): Translation[] {
        const translations = [];
        _.forEach(source, (v) => translations.push(Mapper.MapTranslation(v)));
        return translations;
    }

    public static MapTranslation(source: any): Translation {
        const translation = new Translation();
        translation.id = source.id;
        translation.language = source.language;
        translation.languageId = source.languageId;
        translation.value = source.value;
        translation.wordId = source.wordId;

        translation.selfLink = Mapper.findHrefWithRel(source.links, RelTypes.Self);
        translation.parentLink = Mapper.findHrefWithRel(source.links, RelTypes.Word);
        translation.updateLink = Mapper.findHrefWithRel(source.links, RelTypes.Update);
        translation.deleteLink = Mapper.findHrefWithRel(source.links, RelTypes.Delete);

        return translation;
    }

    public static MapMeaningContexts(source: any): MeaningContext[] {
        const contexts = [];
        _.forEach(source, (v) => contexts.push(Mapper.MapMeaningContext(v)));
        return contexts;
    }

    public static MapMeaningContext(source: any): MeaningContext {
        const ct = new MeaningContext();
        ct.context = source.context;
        ct.meanings = Mapper.MapMeanings(source.meanings);

        ct.selfLink = Mapper.findHrefWithRel(source.links, RelTypes.Self);

        return ct;
    }

    public static MapMeanings(source: any): Meaning[] {
        const meanings = [];
        _.forEach(source, (v) => meanings.push(Mapper.MapMeaning(v)));
        return meanings;
    }

    public static MapMeaning(source: any): Meaning {
        const meaning = new Meaning();
        meaning.id = source.id;
        meaning.wordId = source.wordId;
        meaning.value = source.value;
        meaning.example = source.example;
        meaning.selfLink =  Mapper.findHrefWithRel(source.links, RelTypes.Self);
        meaning.parentLink =  Mapper.findHrefWithRel(source.links, RelTypes.Word);
        meaning.updateLink = Mapper.findHrefWithRel(source.links, RelTypes.Update);
        meaning.deleteLink = Mapper.findHrefWithRel(source.links, RelTypes.Delete);

        return meaning;
    }

    public static MapRelations(source: any): Relation[] {
        const relations = [];
        _.forEach(source, (v) => relations.push(Mapper.MapRelation(v)));
        return relations;
    }

    public static MapRelation(source: any): Relation {
        const relation = new Relation();
        relation.id = source.id;
        relation.sourceWord = source.sourceWord;
        relation.sourceWordId = source.sourceWordId;
        relation.relatedWord = source.relatedWord;
        relation.relatedWordId = source.relatedWordId;
        relation.relationType = source.relationType;
        relation.relationTypeId = source.relationTypeId;

        relation.selfLink =  Mapper.findHrefWithRel(source.links, RelTypes.Self);
        relation.relatedWordLink =  Mapper.findHrefWithRel(source.links, RelTypes.RelatedWord);
        relation.updateLink = Mapper.findHrefWithRel(source.links, RelTypes.Update);
        relation.deleteLink = Mapper.findHrefWithRel(source.links, RelTypes.Delete);

        return relation;
    }

    private static findHrefWithRel(links: any, rel: string) {
        const link: any = _.find(links, ['rel', rel]);
        if (link != null) {
            return link.href;
        }

        return null;
    }
}
