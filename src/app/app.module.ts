// Framework Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';

// Third Party Imports
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OAuthModule } from 'angular-oauth2-oidc';

//  modules and components
import { AppRoutingModule } from './app-routing.module';
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
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    OAuthModule.forRoot()
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
