import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule, Router, NavigationStart } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AuthenticationService } from './authentication.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    currentRoute: String = '';
    isRtl: Boolean = false;

    constructor(private router: Router,
                private translate: TranslateService,
                private authService: AuthenticationService,
                private titleService: Title) {
        this.authService.configureOAuth();
        this.setLanguages();
        this.router.events
            .subscribe(event => {
                if (event instanceof NavigationStart) {
                    this.currentRoute = event.url;
                }
            });
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.isRtl = event.lang === 'ur';
        });
    }

    private setLanguages() {
        this.translate.addLangs(['en', 'ur']);
        this.translate.setDefaultLang('en');

        this.translate.get('APP.TITLE').subscribe((res: string) => {
            this.titleService.setTitle(res);
        });

        const browserLang: string = this.translate.getBrowserLang();
        const selectedLang = localStorage.getItem('ui-lang');

        this.translate.use(selectedLang ? selectedLang : (browserLang.match(/en|ur/) ? browserLang : 'en'));
        this.isRtl = selectedLang === 'ur';
    }
}
