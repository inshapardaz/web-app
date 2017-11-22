import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { ErrorUnauthorisedComponent } from './error-unauthorised/error-unauthorised.component';
import { ErrorUnexpectedComponent } from './error-unexpected/error-unexpected.component';

const routes: Routes = [
  { path: '',            component: HomeComponent },
  { path: 'home',        component: HomeComponent },
  { path: 'profile',      component: ProfileComponent },
  { path: 'settings',     component: SettingsComponent },
  { path: 'error/unauthorised', component : ErrorUnauthorisedComponent },
  { path: 'error/unknown', component : ErrorUnexpectedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
