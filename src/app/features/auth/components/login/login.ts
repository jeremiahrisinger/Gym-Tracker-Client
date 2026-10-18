import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { LoginService } from '../../services/login-service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Error } from '../../../../common/error/error';

@Component({
  imports: [FormsModule, RouterLink, Error],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private loginService = inject(LoginService);
  private router = inject(Router);
  private changeDetectorRef = inject(ChangeDetectorRef);


  credentials = {
    username: '',
    password: ''
  };
  errors: string[] = [];

  onLogin() {
    this.loginService.login(this.credentials).subscribe({
      next: (response: any) => {
        console.log('Logged in profile saved:', response.data);
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
