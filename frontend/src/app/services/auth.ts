import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface Employee{
  email: string;
  password: string;
}

export interface ResponseDTO {
  id: number;
  name: string;
  title: string;
  role: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = "http://localhost:8080/api/auth/login";

  constructor(private http:HttpClient) {
  }

  login(email: string, password: string): Observable<ResponseDTO> {
    const user: Employee = { email, password };
    return this.http.post<ResponseDTO>(this.loginUrl, user).pipe(
      tap((res: ResponseDTO) => {
        console.log("REs: "+res)
        localStorage.setItem("employee", JSON.stringify(res));
      })
    );
  }

  getLoggedInUser(): ResponseDTO | null {
    const user = localStorage.getItem('employee');
    return user ? JSON.parse(user) as ResponseDTO : null;
  }
}
