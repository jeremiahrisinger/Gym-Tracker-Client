import { Routes } from '@angular/router';
import { WorkoutTracker } from './features/components/workout-tracker/workout-tracker';
import { Login } from './features/auth/components/login/login';
import { SignUp } from './features/auth/components/sign-up/sign-up';
import { WorkoutChart } from './features/components/workout-chart/workout-chart';
import { WorkoutHistory } from './features/components/workout-history/workout-history';
import { Account } from './features/auth/components/account/account';
import { ProgramList } from './features/components/program-list/program-list';
import { EditProgram } from './features/components/edit-program/edit-program';
import { DefaultPage } from './features/components/default-page/default-page';
import { EditProgramDay } from './features/components/edit-program-day/edit-program-day';
import { authGuard } from './core/guards/auth-guard';

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
      { path: 'tracker/:id', component: WorkoutTracker },
      { path: 'chart', component: WorkoutChart },
      { path: 'workouts', component: WorkoutHistory },
      { path: 'programs', component: ProgramList },
      { path: 'edit-program/:id', component: EditProgram },
      { path: 'edit-program-day/:id/:dayName', component: EditProgramDay },
      { path: '**', component: DefaultPage }
    ]
  },

  // Default Routes
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
