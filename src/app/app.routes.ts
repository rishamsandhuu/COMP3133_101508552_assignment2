import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { EmployeeListComponent } from '../app/pages/employees/employee-list/employee-list.component';
import { EmployeeAddComponent } from '../app/pages/employees/employee-add/employee-add.component';
import { EmployeeViewComponent } from '../app/pages/employees/employee-view/employee-view.component';
import { EmployeeEditComponent } from '../app/pages/employees/employees-edit/employee-edit.component';
import { AppShellComponent } from './shared/components/app-shell.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'employees', component: EmployeeListComponent },
      { path: 'employees/add', component: EmployeeAddComponent },
      { path: 'employees/view/:eid', component: EmployeeViewComponent },
      { path: 'employees/edit/:eid', component: EmployeeEditComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];