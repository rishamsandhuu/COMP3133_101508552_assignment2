import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="auth-page">
      <mat-card class="auth-card">
        <h2>Login</h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username or Email</mat-label>
            <input matInput formControlName="usernameOrEmail" />
            <mat-error *ngIf="form.get('usernameOrEmail')?.hasError('required')">
              Username or email is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" />
            <mat-error *ngIf="form.get('password')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="form.get('password')?.hasError('minlength')">
              Password must be at least 6 characters
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full-width" type="submit" [disabled]="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <p class="auth-link">
          Don’t have an account?
          <a routerLink="/signup">Sign up</a>
        </p>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f5f7fb;
      padding: 24px;
    }

    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 24px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 14px;
    }

    h2 {
      margin-bottom: 20px;
      text-align: center;
    }

    .auth-link {
      margin-top: 16px;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  loading = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const usernameOrEmail = this.form.get('usernameOrEmail')?.value ?? '';
    const password = this.form.get('password')?.value ?? '';

    this.loading = true;

    this.authService.login(usernameOrEmail, password).subscribe({
      next: (response) => {
        this.snackBar.open(response.message || 'Login successful', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.loading = false;
        const message =
          error?.graphQLErrors?.[0]?.message ||
          error?.message ||
          'Login failed';
        this.snackBar.open(message, 'Close', { duration: 4000 });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}