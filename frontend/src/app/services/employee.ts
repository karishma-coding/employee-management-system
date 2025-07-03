import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) {
    
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  saveEmployee(employee: Employee): Observable<Employee>{
    return this.http.post<Employee>(this.baseUrl, employee);
  }

  updateEmployee(employeeId: number, employee: Employee): Observable<Employee>{
    return this.http.put<Employee>(this.baseUrl,employee);
  }
}
