import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CURRENT_USER_LABEL } from '../../../../common/constants';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { LoginService } from '../../services/login-service';
import { Router } from '@angular/router';
import { Error } from '../../../../common/error/error';

@Component({
  imports: [FormsModule, Error],
  selector: 'app-account',
  styleUrl: './account.css',
  templateUrl: './account.html',
})
export class Account implements OnInit {

  private loginService = inject(LoginService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private router = inject(Router);

  user: any = {
    username: 'Loading...',
    email: 'Loading...',
    name: 'Loading...'
  };
  confirmPassword: string = '';
  errors: string[] = [];


  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.loginService.getUser().subscribe({
      next: (data: any) => {
        this.user = {
          username: data.user.username,
          email: data.user.email,
          name: data.user.name
        };
        this.confirmPassword = ''
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errors = [err.error.error]
        this.changeDetectorRef.detectChanges();

        console.error('Could not load data from Express server:', err);
      }
    })
  }

  updateUser(): void {
    this.loginService.updateUser(this.user, this.confirmPassword).subscribe({
      next: (data: any) => {
        this.user = data.user;
        this.confirmPassword = ''
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errors = [err.error.error]
        this.changeDetectorRef.detectChanges();
        console.error('Could not load data from Express server:', err);
      }
    });
  }

  deleteAccount(): void {
    //this.loginService.deleteUser()
    this.errors = ['This feature is not available.'];
    this.changeDetectorRef.detectChanges();

  }
}
