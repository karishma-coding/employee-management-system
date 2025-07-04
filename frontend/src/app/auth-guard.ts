import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: "root"
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId:Object){
  }

  canActivate(): boolean {
    if(isPlatformBrowser(this.platformId)){
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if(isLoggedIn==="true"){
        return true;
      }
    }
    this.router.navigate(["/"]);
      return false;
  }
};