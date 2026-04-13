import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Employee, EmployeeService } from '../../../core/services/employee.service';
import { FullNamePipe } from '../../../shared/pipes/full-name.pipe';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe,
    DatePipe,
    FullNamePipe,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="page">
      <mat-card class="details-card" *ngIf="employee; else loadingTpl">
        <div class="top-row">
          <div>
            <h1>Employee Details</h1>
            <p>View full employee record</p>
          </div>

          <div class="top-actions">
            <button mat-stroked-button routerLink="/employees">Back</button>
            <button mat-raised-button color="primary" [routerLink]="['/employees/edit', employee._id]">
              Edit
            </button>
          </div>
        </div>

        <div class="profile">
          <img
            *ngIf="employee.employee_photo; else fallback"
            [src]="employee.employee_photo"
            alt="Employee photo"
            class="avatar"
          />

          <ng-template #fallback>
            <div class="avatar-placeholder">
              {{ getInitials(employee) }}
            </div>
          </ng-template>

          <div>
            <h2>{{ employee | fullName }}</h2>
            <p>{{ employee.designation }}</p>
          </div>
        </div>

        <div class="details-grid">
          <div class="detail-item">
            <span class="label">Email</span>
            <span>{{ employee.email }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Gender</span>
            <span>{{ employee.gender || 'N/A' }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Department</span>
            <span>{{ employee.department }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Position / Designation</span>
            <span>{{ employee.designation }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Salary</span>
            <span>{{ employee.salary | currency }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Date of Joining</span>
            <span>{{ employee.date_of_joining | date:'mediumDate' }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Created At</span>
            <span>{{ employee.created_at ? (employee.created_at | date:'medium') : 'N/A' }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Updated At</span>
            <span>{{ employee.updated_at ? (employee.updated_at | date:'medium') : 'N/A' }}</span>
          </div>
        </div>
      </mat-card>

      <ng-template #loadingTpl>
        <mat-card class="details-card">
          <div class="loading-box">Loading employee details...</div>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: #f5f7fb;
      padding: 24px;
    }

    .details-card {
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

    .top-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .profile {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }

    .profile h2 {
      margin: 0 0 6px 0;
    }

    .profile p {
      margin: 0;
      color: #666;
    }

    .avatar,
    .avatar-placeholder {
      width: 110px;
      height: 110px;
      border-radius: 16px;
    }

    .avatar {
      object-fit: cover;
      border: 1px solid #ddd;
    }

    .avatar-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #dbe4ff;
      color: #2847a1;
      font-size: 28px;
      font-weight: 700;
    }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .detail-item {
      padding: 16px;
      border: 1px solid #e4e6eb;
      border-radius: 12px;
      background: #fff;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .label {
      font-size: 13px;
      font-weight: 600;
      color: #666;
    }

    .loading-box {
      padding: 24px;
      text-align: center;
      color: #666;
    }

    @media (max-width: 800px) {
      .details-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class EmployeeViewComponent implements OnInit {
  employee: Employee | null = null;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const eid = this.route.snapshot.paramMap.get('eid');

    if (!eid) {
      this.snackBar.open('Missing employee id', 'Close', { duration: 4000 });
      return;
    }

    this.employeeService.getEmployeeByEid(eid).subscribe({
      next: (employee) => {
        this.employee = employee;
      },
      error: (error) => {
        const message =
          error?.graphQLErrors?.[0]?.message ||
          error?.message ||
          'Failed to load employee details';
        this.snackBar.open(message, 'Close', { duration: 4000 });
      },
    });
  }

  getInitials(employee: Employee): string {
    const first = employee.first_name?.charAt(0) || '';
    const last = employee.last_name?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  }
}