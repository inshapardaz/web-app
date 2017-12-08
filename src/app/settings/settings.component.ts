import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public selectedTheme = '';
  constructor(
    public translate: TranslateService
  ) {
  }

  public ngOnInit(): void {
    throw new Error('Not implemented yet.');
  }

  public setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('ui-lang', lang);
  }

  public setTheme(theme: string) {

  }
}
