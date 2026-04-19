import { Routes } from '@angular/router';
import { PromptListComponent } from './components/prompt-list/prompt-list';
import { PromptDetailComponent } from './components/prompt-detail/prompt-detail';
import { AddPromptComponent } from './components/add-prompt/add-prompt';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { HowToUseComponent } from './components/how-to-use/how-to-use';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

// Simple Auth Guard
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.currentUser()?.authenticated) {
    return true;
  }
  return router.parseUrl('/login');
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'prompts', component: PromptListComponent },
  { path: 'prompts/:id', component: PromptDetailComponent },
  { path: 'add-prompt', component: AddPromptComponent },
  { path: 'edit-prompt/:id', component: AddPromptComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'how-to-use', component: HowToUseComponent },
  { path: '**', redirectTo: 'prompts' }
];
