import { Component, Input } from '@angular/core';
import { Router, RouterModule  } from '@angular/router';

import {Auth} from '../../services/auth.service';

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})

export class HeaderComponent {
    @Input() miniHeader: boolean = false;
    searchText: string = "";
    
    constructor(
        private router: Router,
        private auth: Auth
    ) {

     }

    onSearch(event : any): void {
        if (event.keyCode == 13) {
            this.router.navigate(['/search', this.searchText]);
        }
    }

    toggleSidebar(){
        
    }
}
