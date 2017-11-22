import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() miniHeader: Boolean = false;
  searchText: String = '';
  profile: any;

  constructor(
      private router: Router,
      private auth: AuthenticationService,
      public translate: TranslateService
  ) {
  }

  ngOnInit() {
  }

  onSearch(event: any): void {
      if (event.keyCode === 13) {
          this.router.navigate(['/search', this.searchText]);
      }
  }
}
