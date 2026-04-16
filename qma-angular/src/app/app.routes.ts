import { Routes } from '@angular/router';

import { ConverterComponent } from './features/converter/converter.component';
import { HistoryComponent } from './features/history/history.component';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'converter' },
  { path: 'converter', component: ConverterComponent },
  { path: 'history', component: HistoryComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: 'converter' }
];
