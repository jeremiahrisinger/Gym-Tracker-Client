import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { Error } from '../../../../common/error/error';
import { ApiResponse } from '../../../../core/models/api-response';
import { User } from '../../models/user';
import { Input } from '../../../../common/components/input/input';

@Component({
  imports: [FormsModule, RouterLink, Error, Input],
  selector: 'app-sign-up',
  styleUrl: './sign-up.css',
  templateUrl: './sign-up.html',
})
export class SignUp {
  private loginService = inject(AuthService);
  private router = inject(Router)
  private changeDetectorRef = inject(ChangeDetectorRef);

  errors: string[] = [];

  newUser = {
    username: '',
    email: '',
    password: '',
    name: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  onSignUp() {
    this.loginService.signup(this.newUser).subscribe({
      next: (response: ApiResponse<User>) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errors = [err.error.message]
        this.changeDetectorRef.detectChanges();
        console.error('Authentication rejected:', err);
      }
    });
  }
}
