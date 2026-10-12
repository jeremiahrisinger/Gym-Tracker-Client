import { Component, signal, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CURRENT_USER_LABEL } from './common/constants';
import { LoginService } from './features/auth/services/login-service';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [RouterOutlet, RouterLink, AsyncPipe, MatIcon],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('client');
  protected loginService = inject(LoginService);

  protected userId: any = this.loginService.isLoggedIn();
  private changeDetectorRef = inject(ChangeDetectorRef);

  private router = inject(Router);

  ngOnInit(): void {
    this.userId = this.loginService.isLoggedIn();
    this.changeDetectorRef.detectChanges();
  }

  onLogout() {
    this.userId = null;
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}


