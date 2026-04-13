import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password !== confirmPassword ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-signup',
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
        <h2>Sign Up</h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" />
            <mat-error *ngIf="form.get('username')?.hasError('required')">
              Username is required
            </mat-error>
            <mat-error *ngIf="form.get('username')?.hasError('minlength')">
              Username must be at least 3 characters
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" />
            <mat-error *ngIf="form.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">
              Enter a valid email
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

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirm Password</mat-label>
            <input matInput type="password" formControlName="confirmPassword" />
            <mat-error *ngIf="form.get('confirmPassword')?.hasError('required')">
              Confirm password is required
            </mat-error>
            <mat-error *ngIf="form.hasError('passwordMismatch')">
              Passwords do not match
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full-width" type="submit" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Sign Up' }}
          </button>
        </form>

        <p class="auth-link">
          Already have an account?
          <a routerLink="/login">Login</a>
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
export class SignupComponent {
  loading = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const username = this.form.get('username')?.value?.trim() || '';
    const email = this.form.get('email')?.value?.trim() || '';
    const password = this.form.get('password')?.value || '';

    this.loading = true;

    this.authService.signup(username, email, password).subscribe({
      next: (response) => {
        this.snackBar.open(response.message || 'Signup successful', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        const message =
          error?.graphQLErrors?.[0]?.message ||
          error?.message ||
          'Signup failed';
        this.snackBar.open(message, 'Close', { duration: 4000 });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}