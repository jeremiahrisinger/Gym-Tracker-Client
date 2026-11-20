import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../auth/models/user';
import { Router } from '@angular/router';
import { Error } from '../../../common/error/error';
import { ApiResponse } from '../../../core/models/api-response';
import { UserService } from '../../services/user-service';
import { Input } from '../../../common/components/input/input';

@Component({
  imports: [FormsModule, Error, Input],
  selector: 'app-account',
  styleUrl: './account.css',
  templateUrl: './account.html',
})
export class Account implements OnInit {

  private userService = inject(UserService);
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
    this.userService.getUser().subscribe({
      next: (response: ApiResponse<User>) => {
        this.user = response.data;
        this.confirmPassword = ''
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errors = [err.error.message]
        this.changeDetectorRef.detectChanges();

        console.error('Could not load data from Express server:', err);
      }
    })
  }

  updateUser(): void {
    this.userService.updateUser(this.user, this.confirmPassword).subscribe({
      next: (response: ApiResponse<User>) => {
        this.user = response.data;
        this.confirmPassword = ''
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errors = [err.error.message]
        this.changeDetectorRef.detectChanges();
        console.error('Could not load data from Express server:', err);
      }
    });
  }

  deleteAccount(): void {
    //this.userService.deleteUser()
    this.errors = ['This feature is not available.'];
    this.changeDetectorRef.detectChanges();

  }
}
