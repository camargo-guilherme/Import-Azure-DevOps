import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, map, throwError, Observable } from 'rxjs';
import { BaseService } from './base.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends BaseService {
  constructor(
    private router: Router,
    notificationService: NotificationService,
    spinnerService: NgxSpinnerService,
  ) {
    super(notificationService, spinnerService);
  }

  async login(pat: string): Promise<void> {
    localStorage.setItem("PAT", pat);
    return this.get<any>('_apis/projects/?api-version=4.1').then(
      (result) => {
        this.router.navigate(['/home']);
      }
    ).catch(error => {
      console.log('login', error);
      return error;
    }).finally(() => {
      this.spinnerService.hide();
    });
  }

  async validateSession(): Promise<void> {
    return this.get<any>('_apis/projects/?api-version=4.1').then(
      (result) => {
        if (result.status == 203) {
          localStorage.clear();
          this.router.navigate(['/login']);
          throw new Error('Invalid token');
        }
      }
    ).catch(error => {
      console.log('validateSession', error);
      localStorage.clear();
      this.router.navigate(['/login']);
      return error;
    }).finally(() => {
      this.spinnerService.hide();
    });
  }

  logout() {
    this.removeUserToken();
  }

  removeUserToken() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }


  serviceErrorSession(result: HttpErrorResponse) {
    return throwError(() => {
      localStorage.clear();
      return false;
    });
  }
}
