import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-add',
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
    MatSelectModule,
  ],
  template: `
    <div class="page">
      <mat-card class="form-card">
        <div class="top-row">
          <div>
            <h1>Add Employee</h1>
            <p>Create a new employee record</p>
          </div>

          <button mat-stroked-button routerLink="/employees">
            Back
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="first_name" />
              <mat-error *ngIf="form.get('first_name')?.hasError('required')">
                First name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="last_name" />
              <mat-error *ngIf="form.get('last_name')?.hasError('required')">
                Last name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" />
              <mat-error *ngIf="form.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">
                Enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Gender</mat-label>
              <mat-select formControlName="gender">
                <mat-option value="Male">Male</mat-option>
                <mat-option value="Female">Female</mat-option>
                <mat-option value="Other">Other</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Position / Designation</mat-label>
              <input matInput formControlName="designation" />
              <mat-error *ngIf="form.get('designation')?.hasError('required')">
                Designation is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Department</mat-label>
              <input matInput formControlName="department" />
              <mat-error *ngIf="form.get('department')?.hasError('required')">
                Department is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Salary</mat-label>
              <input matInput type="number" formControlName="salary" />
              <mat-error *ngIf="form.get('salary')?.hasError('required')">
                Salary is required
              </mat-error>
              <mat-error *ngIf="form.get('salary')?.hasError('min')">
                Salary must be at least 1000
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date of Joining</mat-label>
              <input matInput type="date" formControlName="date_of_joining" />
              <mat-error *ngIf="form.get('date_of_joining')?.hasError('required')">
                Date of joining is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="upload-section">
            <label class="upload-label">Profile Picture</label>
            <input type="file" accept="image/*" (change)="onFileSelected($event)" />

            <div class="preview" *ngIf="imagePreview">
              <img [src]="imagePreview" alt="Preview" />
            </div>
          </div>

          <div class="actions">
            <button mat-stroked-button type="button" routerLink="/employees">
              Cancel
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="loading">
              {{ loading ? 'Saving...' : 'Add Employee' }}
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: #f5f7fb;
      padding: 24px;
    }

    .form-card {
      max-width: 1000px;
      margin: 0 auto;
      padding: 24px;
    }

    .top-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .top-row h1 {
      margin: 0 0 6px 0;
    }

    .top-row p {
      margin: 0;
      color: #666;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .upload-section {
      margin-top: 20px;
    }

    .upload-label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .preview {
      margin-top: 12px;
    }

    .preview img {
      width: 120px;
      height: 120px;
      border-radius: 12px;
      object-fit: cover;
      border: 1px solid #ddd;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      flex-wrap: wrap;
    }

    @media (max-width: 800px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class EmployeeAddComponent {
  loading = false;
  imageBase64 = '';
  imagePreview = '';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['Other'],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      salary: [1000, [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = String(reader.result || '');
      this.imagePreview = this.imageBase64;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const raw = this.form.getRawValue();

    this.employeeService.addEmployee({
      ...raw,
      salary: Number(raw.salary),
      date_of_joining: new Date(raw.date_of_joining).toISOString(),
      employee_photo_base64: this.imageBase64 || undefined,
    }).subscribe({
      next: (response) => {
        this.snackBar.open(response.message || 'Employee added successfully', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.loading = false;
        const message =
          error?.graphQLErrors?.[0]?.message ||
          error?.message ||
          'Failed to add employee';
        this.snackBar.open(message, 'Close', { duration: 4000 });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}