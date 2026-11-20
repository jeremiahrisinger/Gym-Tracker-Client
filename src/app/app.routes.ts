import { Routes } from '@angular/router';
import { WorkoutTracker } from './features/components/workout-tracker/workout-tracker';
import { Login } from './features/auth/components/login/login';
import { SignUp } from './features/auth/components/sign-up/sign-up';
import { Account } from './features/components/account/account';
import { ProgramList } from './features/components/program-list/program-list';
import { DefaultPage } from './features/components/default-page/default-page';
import { authGuard } from './core/guards/auth-guard';
import { WorkoutList } from './features/components/workout-list/workout-list';
import { EditProgram } from './features/components/edit-program/edit-program';
import { EditDay } from './features/components/edit-day/edit-day';

export const routes: Routes = [
  // Public Routes
  { path: 'login', component: Login },
  { path: 'signup', component: SignUp },

  // Authenticated Routes
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'account', component: Account },
      { path: 'workouts', component: WorkoutList },
      { path: 'tracker/:workoutId', component: WorkoutTracker },
      { path: 'programs', component: ProgramList },
      { path: 'edit-program/:programId', component: EditProgram },
      { path: 'edit-program/:programId/:dayId', component: EditDay},
      { path: 'pageNotFound', component: DefaultPage },
      { path: '**', redirectTo: 'pageNotFound', pathMatch: 'full'}
    ]
  },

  // Default Routes
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
