import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Error } from '../../../../common/error/error';
import { ApiResponse } from '../../../../core/models/api-response';
import { User } from '../../models/user';
import { Input } from '../../../../common/components/input/input';

@Component({
  imports: [FormsModule, RouterLink, Error, Input],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private loginService = inject(AuthService);
  private router = inject(Router);
  private changeDetectorRef = inject(ChangeDetectorRef);


  credentials = {
    username: '',
    password: ''
  };
  errors: string[] = [];

  onLogin() {
    this.loginService.login(this.credentials).subscribe({
      next: (response: ApiResponse<User>) => {
        this.router.navigate(['/workouts']);
      },
      error: (err) => {
        console.error('Authentication rejected:', err)
        this.errors = [err.error.message];
        this.changeDetectorRef.detectChanges();
      }

    });
  }

}
