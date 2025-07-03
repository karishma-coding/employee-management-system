import { Component, OnInit } from '@angular/core';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
  employee: Employee = { name: '', title: '', email: '', password: ''};
  searchTerm: string='';
  showModal: boolean = false;
  employeeForm!: FormGroup;
  

  constructor(private fb: FormBuilder, private service: EmployeeService) {

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
      console.log(this.employeeForm.get('name')?.errors);
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

  resetForm(): void{
    this.employee = { name: '', title: '', email: '', password: ''};
  }

  openModal(): void{
    this.showModal = true;
    this.resetForm();
  }

  closeModal(): void{
    this.showModal = false;
  }
}