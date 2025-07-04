import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class LoginComponent implements OnInit{
  email = "";
  password = "";
  errorMsg = "";
  loginForm!: FormGroup; 
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){
  }

  ngOnInit(): void{
    this.loginForm = this.fb.group({
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
  }

  onLogin(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return
    }
    const { email, password } = this.loginForm.value;
    this.authService.login(email,password).subscribe({
      next: (res: string) => {
        if(res==""){
          localStorage.setItem("isLoggedIn","true")
          this.router.navigate(["/employee"]);
        }
        else{
          this.errorMsg = res;
        }
      },
      error: () => {
        console.log("Server error. Try again later");
      }
    });
  }

  togglePassword(): void{
    this.showPassword = !this.showPassword;
  }  
}
