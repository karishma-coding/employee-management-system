import { Routes } from '@angular/router';
import { EmployeeComponent } from './components/employee/employee';
import { LoginComponent } from './components/login/login';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },        // Login as default route
  { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard] }
];