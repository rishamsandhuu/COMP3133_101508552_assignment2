import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <div class="toolbar-inner">
        <a routerLink="/employees" class="brand">Employee Management</a>

        <div class="nav-links">
          <a mat-button routerLink="/employees" routerLinkActive="active-link">Employees</a>
          <a mat-button routerLink="/employees/add" routerLinkActive="active-link">Add Employee</a>
        </div>
      </div>
    </mat-toolbar>

    <router-outlet />
  `,
  styles: [`
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .toolbar-inner {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .brand {
      color: white;
      text-decoration: none;
      font-weight: 700;
      font-size: 18px;
    }

    .nav-links {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .active-link {
      font-weight: 700;
      text-decoration: underline;
    }
  `],
})
export class AppShellComponent {}