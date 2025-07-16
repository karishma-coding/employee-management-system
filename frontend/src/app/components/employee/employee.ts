import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { title } from 'process';
import { error } from 'console';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService, ResponseDTO } from '../../services/auth';

@Component({
  standalone: true,
  selector: 'app-employee',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css'
})

export class EmployeeComponent implements OnInit{
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  paginatedEmployees: Employee[] = [];
  loading: boolean = true;
  employee: Employee = {id: 0, name: '', title: '', email: '', password: ''};
  loggedInEmployee: ResponseDTO | null = null;
  searchTerm: string='';
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  employeeForm!: FormGroup;  
  employeeId: number | null = null;
  showPassword: boolean = false;
  validationErrors: { [key: string]: string } = {}; 
  errorMsg: string = "";
  pageSize: number = 10;
  currentPage: number = 0;
  totalPages: number = 0;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedAll: boolean = false;
  selectedEmployeeIds: number[] = [];
  loggedInEmail = '';
  role = '';

  constructor(private fb: FormBuilder, private service: EmployeeService, private router: Router, private authService: AuthService) {

  }
  
  ngOnInit(): void {
    this.loading = true;
    this.loggedInEmployee = this.authService.getLoggedInUser();
    this.loggedInEmail = localStorage.getItem("loggedInEmail") || "";
    this.role = localStorage.getItem("role") || "";
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      title: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/)
        ]
      ]
    });
    this.getEmployees();
    this.filteredEmployees = this.employees;
    this.loading = false;
  }

  getEmployees(): void {
    this.service.getEmployees().subscribe(
      (data) => {
        this.employees = data;
        this.filterEmployees();
      }
    );
  }
  
  onSearchTermChange(): void{
    this.currentPage = 0;
    this.filterEmployees();
  }

  filterEmployees(): void{
    const term = this.searchTerm.toLowerCase();
    this.currentPage = 0;
    this.filteredEmployees = this.employees.filter(emp => 
      emp.id?.toString().toLowerCase().includes(this.searchTerm) ||
      emp.name.toLowerCase().includes(this.searchTerm) ||
      emp.title.toLowerCase().includes(this.searchTerm) ||
      emp.email.toLowerCase().includes(this.searchTerm)
    );
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    this.paginateEmployees();
  }

  onPageSizeChange(): void{
    this.currentPage = 0;
    this.totalPages = Math.ceil(this.filteredEmployees.length/this.pageSize);
    this.paginateEmployees();
  }

  paginateEmployees(): void{
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedEmployees = this.filteredEmployees.slice(start,end);
  }

  goToPage(pageIndex : number): void{
    if(pageIndex >=0 && pageIndex < this.totalPages){
      this.currentPage = pageIndex;
      this.paginateEmployees();
    }
  }

  saveEmployee(): void{
    if(this.employeeForm.invalid){
      this.employeeForm.markAllAsTouched();
      return
    }
    this.employee = this.employeeForm.value;
    this.service.saveEmployee(this.employee).subscribe({
      next: () => {
        this.getEmployees();
        this.resetForm();
        this.closeModal();
      },
      error: (err) => {
        if(err.status === 400 && typeof err.error === "object"){
          this.validationErrors = err.error;
        }
        else{
          this.errorMsg = "Failed to save Employees. Please try again";
        }
      }
    });
  }

  updateEmployee(): void{
    if(this.employeeForm.invalid){
      this.employeeForm.markAllAsTouched();
      return
    }
    this.employee = this.employeeForm.value;
    this.service.updateEmployee(this.employeeId!, this.employee).subscribe( () => {
      this.getEmployees();
      this.resetForm();
      this.closeModal();
    })
  }

  deleteEmployee(id: number): void {
    const confirmed = confirm("Do you wish to delete the records of employee id: " + id + "?");
    if(confirmed){
      this.service.deleteEmployee(id).subscribe({
        next: () => {
          this.getEmployees();
        },
        error: () => {
          console.log("Error occured while deleting employee records.");
        }
      });
    }
  }

  toggleAllSelection(): void {
    this.paginatedEmployees.forEach(emp => emp.selected = this.selectedAll);
    this.updateSelection();
  }

  updateSelection(): void{
    this.selectedEmployeeIds = this.paginatedEmployees.filter(emp => emp.selected).map(emp => emp.id);
    this.selectedAll = this.paginatedEmployees.length > 0 &&
                        this.paginatedEmployees.every(emp => emp.selected);    
  }

  deleteSelectedEmployees(): void{
    const confirmed = confirm(`Are you sure you want to delete ${this.selectedEmployeeIds.length} employee(s)`);
    if(!confirmed){
      return;
    }
    const deleteObservables = this.selectedEmployeeIds.map(id => this.service.deleteEmployee(id));
    forkJoin(deleteObservables).subscribe({
      next: () => {
        this.getEmployees();
        this.selectedEmployeeIds = [];
        this.selectedAll = false;
      },
      error: (err) => {
        console.log("Error occurred while deleteing records: "+err);
      }
    });
  }

  resetForm(): void{
    this.employee = {id: 0, name: '', title: '', email: '', password: ''};
    this.employeeForm.get('name')?.setValue('');
    this.employeeForm.get('title')?.setValue('');
    this.employeeForm.get('email')?.setValue('');
    this.employeeForm.get('password')?.setValue('');
  }

  openAddModal(): void{
    this.showAddModal = true;
    this.resetForm();
    if(!this.employeeForm.contains("password")){
      this.employeeForm.addControl("password",
        this.fb.control('',[
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/)
        ])
      );
    }
  }

  openEditModal(emp: any): void{
    this.showEditModal = true;
    this.employeeId = emp.id;

    if(this.employeeForm.contains("password")){
      this.employeeForm.removeControl("password");
    }

    this.employeeForm.patchValue({
      name: emp.name,
      title: emp.title,
      email: emp.email
    });
  }

  closeModal(): void{
    this.showAddModal = false;
    this.showEditModal = false;
  }
  
  togglePassword(): void{
    this.showPassword = !this.showPassword;
  }  

  logout(): void{
    localStorage.removeItem("loggedInEmail");
    localStorage.removeItem("employee");
    localStorage.removeItem("role");
    this.router.navigate(["/"]);
  }

  validationErrorKeys(): string[] {
    return Object.keys(this.validationErrors);
  }

  sortBy(column: keyof Employee, direction?: "asc" | "desc"): void{
    if(direction){
      this.sortDirection = direction;
      this.sortColumn = column;
    }
    else{
      if(this.sortColumn === column){
        this.sortDirection = this.sortDirection=="asc" ? "desc" : "asc";
      }
      else{
        this.sortColumn = column;
        this.sortDirection = "asc";
      }
    }
    this.filteredEmployees.sort((a,b) => {
      const valA = a[column]?.toString().toLowerCase() || "";
      const valB = b[column]?.toString().toLowerCase() || "";
      if(valA < valB){
        return this.sortDirection === "asc" ? -1 : 1;
      }
      else{
        return this.sortDirection === "asc" ? 1 : -1;
      }
    });
    this.paginateEmployees();
  }
}