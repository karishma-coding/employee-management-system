import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class LoginComponent {
  email = "";
  password = "";
  errorMsg = "";

  constructor(private authService: AuthService, private router: Router){
  }

  onLogin(){
    this.authService.login(this.email,this.password).subscribe({
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
  
}
