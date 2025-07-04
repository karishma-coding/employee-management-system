import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { title } from 'process';
import { error } from 'console';
import { Router } from '@angular/router';

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
  loading: boolean = true;
  employee: Employee = {id: 0, name: '', title: '', email: '', password: ''};
  searchTerm: string='';
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  employeeForm!: FormGroup;  
  employeeId: number | null = null;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private service: EmployeeService, private router: Router) {

  }
  
  ngOnInit(): void {
    this.loading = true;
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

  filterEmployees(): void{
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp => 
      emp.id?.toString().toLowerCase().includes(this.searchTerm) ||
      emp.name.toLowerCase().includes(this.searchTerm) ||
      emp.title.toLowerCase().includes(this.searchTerm) ||
      emp.email.toLowerCase().includes(this.searchTerm)
    );
  }

  saveEmployee(): void{
    if(this.employeeForm.invalid){
      this.employeeForm.markAllAsTouched();
      return
    }
    this.employee = this.employeeForm.value;
    this.service.saveEmployee(this.employee).subscribe( () => {
      this.getEmployees();
      this.resetForm();
      this.closeModal();
    })
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

  resetForm(): void{
    this.employee = {id: 0, name: '', title: '', email: '', password: ''};
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
    localStorage.removeItem("isLoggedIn");
    this.router.navigate(["/"]);
  }
}