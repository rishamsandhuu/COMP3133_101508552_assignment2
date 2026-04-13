import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { Employee, EmployeeService } from '../../../core/services/employee.service';
import { HighlightCardDirective } from '../../../shared/directives/highlight-card.directive';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    DatePipe,
    CurrencyPipe,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    HighlightCardDirective,
  ],
  template: `
    <div class="page">
      <mat-card class="page-card" appHighlightCard>
        <div class="header">
          <div>
            <h1>Employees</h1>
            <p>Manage employee records</p>
          </div>

          <div class="header-actions">
            <button mat-raised-button color="primary" routerLink="/employees/add">
              Add Employee
            </button>
            <button mat-stroked-button color="warn" (click)="logout()">
              Logout
            </button>
          </div>
        </div>

        <div class="search-grid">
          <mat-form-field appearance="outline">
            <mat-label>Search by position / designation</mat-label>
            <input
              matInput
              [(ngModel)]="designation"
              placeholder="e.g. Developer"
            />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Search by department</mat-label>
            <input
              matInput
              [(ngModel)]="department"
              placeholder="e.g. HR"
            />
          </mat-form-field>

          <div class="search-actions">
            <button
              mat-raised-button
              color="primary"
              (click)="searchEmployees()"
              [disabled]="loading"
            >
              Search
            </button>

            <button
              mat-stroked-button
              (click)="resetFilters()"
              [disabled]="loading"
            >
              Reset
            </button>
          </div>
        </div>

        <div class="table-wrapper" *ngIf="!loading; else loadingTemplate">
          <table
            mat-table
            [dataSource]="employees"
            class="mat-elevation-z1"
            *ngIf="employees.length > 0; else emptyTemplate"
          >
            <ng-container matColumnDef="photo">
              <th mat-header-cell *matHeaderCellDef>Photo</th>
              <td mat-cell *matCellDef="let employee">
                <img
                  *ngIf="employee.employee_photo; else noPhoto"
                  [src]="employee.employee_photo"
                  alt="Employee photo"
                  class="avatar"
                />

                <ng-template #noPhoto>
                  <div class="avatar-placeholder">
                    {{ getInitials(employee) }}
                  </div>
                </ng-template>
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let employee">
                {{ employee.first_name }} {{ employee.last_name }}
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let employee">
                {{ employee.email }}
              </td>
            </ng-container>

            <ng-container matColumnDef="designation">
              <th mat-header-cell *matHeaderCellDef>Position / Designation</th>
              <td mat-cell *matCellDef="let employee">
                {{ employee.designation }}
              </td>
            </ng-container>

            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef>Department</th>
              <td mat-cell *matCellDef="let employee">
                {{ employee.department }}
              </td>
            </ng-container>

            <ng-container matColumnDef="salary">
              <th mat-header-cell *matHeaderCellDef>Salary</th>
              <td mat-cell *matCellDef="let employee">
                {{ employee.salary | currency }}
              </td>
            </ng-container>

            <ng-container matColumnDef="date_of_joining">
              <th mat-header-cell *matHeaderCellDef>Date Joined</th>
              <td mat-cell *matCellDef="let employee">
                {{ employee.date_of_joining | date:'mediumDate' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="actions-col">Actions</th>
              <td mat-cell *matCellDef="let employee" class="actions-col">
                <div class="action-buttons">
                  <button
                    mat-stroked-button
                    color="primary"
                    [routerLink]="['/employees/view', employee._id]"
                  >
                    View
                  </button>

                  <button
                    mat-stroked-button
                    [routerLink]="['/employees/edit', employee._id]"
                  >
                    Edit
                  </button>

                  <button
                    mat-stroked-button
                    color="warn"
                    (click)="deleteEmployee(employee)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <ng-template #loadingTemplate>
          <div class="state-box">Loading employees...</div>
        </ng-template>

        <ng-template #emptyTemplate>
          <div class="state-box">No employees found.</div>
        </ng-template>
      </mat-card>
    </div>
  `,
  styles: [`
    .page {
      padding: 24px;
      background: #f5f7fb;
      min-height: 100vh;
    }

    .page-card {
      max-width: 1300px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid transparent;
    }

    .header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .header h1 {
      margin: 0 0 6px 0;
      font-size: 28px;
    }

    .header p {
      margin: 0;
      color: #666;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .search-grid {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 16px;
      align-items: start;
      margin-bottom: 24px;
    }

    .search-actions {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
      min-height: 56px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    table {
      width: 100%;
      min-width: 1100px;
    }

    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
      border: 1px solid #ddd;
    }

    .avatar-placeholder {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #dbe4ff;
      color: #2847a1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      border: 1px solid #c7d8ff;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .actions-col {
      min-width: 250px;
    }

    .state-box {
      padding: 32px 12px;
      text-align: center;
      color: #666;
      font-size: 16px;
    }

    @media (max-width: 900px) {
      .search-grid {
        grid-template-columns: 1fr;
      }

      .search-actions {
        min-height: auto;
      }
    }
  `],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;

  designation = '';
  department = '';

  displayedColumns: string[] = [
    'photo',
    'name',
    'email',
    'designation',
    'department',
    'salary',
    'date_of_joining',
    'actions',
  ];

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;

    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.showError(error, 'Failed to load employees');
      },
    });
  }

  searchEmployees(): void {
    const designation = this.designation.trim();
    const department = this.department.trim();

    if (!designation && !department) {
      this.loadEmployees();
      return;
    }

    this.loading = true;

    this.employeeService.searchEmployees(designation, department).subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.showError(error, 'Failed to search employees');
      },
    });
  }

  resetFilters(): void {
    this.designation = '';
    this.department = '';
    this.loadEmployees();
  }

  deleteEmployee(employee: Employee): void {
    const confirmed = window.confirm(
      `Delete ${employee.first_name} ${employee.last_name}?`
    );

    if (!confirmed) {
      return;
    }

    this.employeeService.deleteEmployeeByEid(employee._id).subscribe({
      next: (response) => {
        this.snackBar.open(response.message || 'Employee deleted', 'Close', {
          duration: 3000,
        });
        this.loadEmployees();
      },
      error: (error) => {
        this.showError(error, 'Failed to delete employee');
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getInitials(employee: Employee): string {
    const first = employee.first_name?.charAt(0) || '';
    const last = employee.last_name?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  }

  private showError(error: unknown, fallback: string): void {
    const err = error as {
      graphQLErrors?: Array<{ message?: string }>;
      message?: string;
    };

    const message =
      err.graphQLErrors?.[0]?.message ||
      err.message ||
      fallback;

    this.snackBar.open(message, 'Close', {
      duration: 4000,
    });
  }
}