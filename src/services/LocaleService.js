import { addLocaleData } from 'react-intl';

import en from 'react-intl/locale-data/en';
import ur from 'react-intl/locale-data/ur';

import enMessages from '../i18n/en.json';
import urMessages from '../i18n/ur.json';
addLocaleData([...en, ...ur]);

export default class LocaleService {

    async initLocale() {
        let locale = this.getCurrentLanguage();

        if (!locale) {
            locale = "en";
            this.setCurrentLanguage(locale);
        }

        await this.loadFormatDataForLocale(locale);

        let messages = enMessages;
        switch(locale.toLowerCase())
        {
            case "ur":
                messages = urMessages;
        }
        

        return {
            locale: locale,
            messages: messages
        }
    }

    async loadFormatDataForLocale(locale) {
        let data;

        switch (locale) {
            case 'ur-PK':
                data = await import('react-intl/locale-data/ur');
                break;

            default:
                data = await import('react-intl/locale-data/en');
        }

        return addLocaleData(data.default);
    }

    getCurrentLanguage() {
        return window.localStorage.getItem("language");
    }

    setCurrentLanguage(language) {
        window.localStorage.setItem("language", language);
    }
}