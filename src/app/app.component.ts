import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { RouterModule , Router, NavigationStart } from '@angular/router';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {AuthService} from '../services/auth.service';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AppComponent {
    currentRoute: string = "";
    constructor(private router: Router, private auth: AuthService, private translate: TranslateService) {

        translate.addLangs(["en", "ur"]);
        translate.setDefaultLang('ur');

        let browserLang: string = translate.getBrowserLang();
        translate.use(browserLang.match(/en|ur/) ? browserLang : 'ur');

        this.router.events
        .subscribe(event => {
            if (event instanceof NavigationStart){
                 this.currentRoute = event.url;
            }
        });
        auth.handleAuthentication();
        auth.scheduleRenewal();
    }
 }