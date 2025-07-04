import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface Employee{
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = "http://localhost:8080/api/auth/login";

  constructor(private http:HttpClient) {
  }

  login(email: string, password: string): Observable<string> {
    const user: Employee = { email, password };
    return this.http.post(this.loginUrl, user, { responseType: 'text' }).pipe(
      tap((res: string) => {
        if(res===""){
          localStorage.setItem("isLoggedIn","true");
        }
      })
    );
  }
}
