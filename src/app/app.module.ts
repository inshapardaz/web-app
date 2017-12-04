// Framework Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Third Party Imports
import * as $ from 'jquery';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SweetAlert2Module } from '@toverux/ngsweetalert2';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap';

// Directives
import { UIToggleDirective } from './directives/ui-toggle.directive';
import { SideBarToggleDirective } from './directives/side-bar-toggle.directive';
import { AppearDirective } from './directives/appear.directive';
import { RightToLeftDirective } from './directives/right-to-left.directive';

//  Modules
import { AppRoutingModule } from './app-routing.module';
import { DictionaryModule } from './dictionary/dictionary.module';

//  Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

// Services
import { AuthenticationService } from './authentication.service';
import { AlertingService } from './alerting.service';
import { DataService } from './data.service';
import { HomeComponent } from './home/home.component';
import { ErrorUnauthorisedComponent } from './error-unauthorised/error-unauthorised.component';
import { ErrorUnexpectedComponent } from './error-unexpected/error-unexpected.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    ErrorUnauthorisedComponent,
    ErrorUnexpectedComponent,
    SettingsComponent,
    ProfileComponent,

    UIToggleDirective,
    SideBarToggleDirective,
    RightToLeftDirective,
    AppearDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    OAuthModule.forRoot(),
    SweetAlert2Module.forRoot(),
    DictionaryModule
  ],
  providers: [
    HttpClientModule,
    AuthenticationService,
    DataService,
    AlertingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
