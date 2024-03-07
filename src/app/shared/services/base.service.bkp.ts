import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationService } from './notification.service';

export abstract class BaseServiceBkp {
  public urlBase = environment.apiUrl;
  public headers: HttpHeaders = new HttpHeaders();
  public params: HttpParams = new HttpParams();
  public notificationService: NotificationService;
  public spinnerService: NgxSpinnerService;

  constructor(
    private http: HttpClient,
    notificationService: NotificationService,
    spinnerService: NgxSpinnerService
  ) {
    this.notificationService = notificationService;
    this.spinnerService = spinnerService;
    this.headers = this.headers.set(
      'Content-Type',
      'application/json;charset=UTF-8'
    );
  }

  protected serviceError(result: HttpErrorResponse) {
    return throwError(() => {
      this.spinnerService.hide();
      if (result?.error?.errors) {
        result?.error?.errors.forEach((messageError: any) => {
          this.notificationService.notifyError(messageError);
        });

      } else {
        switch (result?.error?.type) {
          case 'warning':
            this.notificationService.notifyInfo(result?.error?.message);
            break;
          case 'alert':
            this.notificationService.notifyWarning(result?.error?.message);
            break;
          default:
            this.notificationService.notifyError(result?.error?.message);
        }
      }
      return result;
    });
  }

  getById<T>(id: number | string): Observable<T> {
    return this.getResult<T>(
      this.http.get<T>(`${this.urlBase}/${id}`)
    );
  }

  // getAllGridView<T>(filter: any = null): Observable<GridViewData<T[]>> {
  //   return this.getResult<GridViewData<T[]>(this.http.post<GridViewData<T[]>>(`${this.urlBase}/get-all`, JSON.stringify(filter), { headers: this.headers }));
  // }

  getAll<T>(filter: any = null): Observable<T> {
    return this.getResult<T>(
      this.http.get<T>(`${this.urlBase}/All`, {
        headers: this.headers,
        params: filter,
      })
    );
  }

  getForSelectData<T>(): Observable<T[]> {
    return this.getResult<T[]>(
      this.http.get<T[]>(`${this.urlBase}/get-for-select-data`, {
        headers: this.headers,
      })
    );
  }

  get<T>(url: string = '', showSpinner: boolean = true): Observable<T> {
    if (showSpinner) {
      this.spinnerService.show();
    }
    return this.getResult<T>(
      this.http.get<any>(`${this.urlBase + url}`, { headers: this.headers })
    );
  }

  getBlob<T>(url: string = '', showSpinner: boolean = true): Observable<T> {
    if (showSpinner) {
      this.spinnerService.show();
    }
    return this.getResult<T>(
      this.http.get<any>(`${this.urlBase + url}`, this.getHeaderBlob())
    );
  }

  post<TRequest, TResponse>(
    obj: TRequest,
    url: string = ''
  ): Observable<TResponse> {
    return this.getResult<TResponse>(
      this.http.post<TResponse>(
        `${this.urlBase + url}`,
        JSON.stringify(obj),
        { headers: this.headers }
      )
    );
  }

  patch<TRequest, TResponse>(
    obj: TRequest,
    url: string = ''
  ): Observable<TResponse> {
    return this.getResult<TResponse>(
      this.http.patch<TResponse>(
        `${this.urlBase + url}`,
        JSON.stringify(obj),
        { headers: this.headers }
      )
    );
  }

  put<TRequest, TResponse>(
    obj: TRequest,
    url: string = ''
  ): Observable<TResponse> {
    return this.getResult<TResponse>(
      this.http.put<TResponse>(
        `${this.urlBase + url}`,
        JSON.stringify(obj),
        { headers: this.headers }
      )
    );
  }

  delete(id?: number, url: string = '') {
    return this.http.delete(id ? `${this.urlBase + url}/${id}` : `${this.urlBase + url}`);
  }

  changeStatus(id: number): Observable<boolean> {
    return this.getResult<boolean>(
      this.http.post<boolean>(
        `${this.urlBase}/change-status`,
        JSON.stringify(id),
        { headers: this.headers }
      )
    );
  }

  sendFile(formData: any, url: string = ''): Observable<boolean> {
    return this.getResult<boolean>(
      this.http.post<boolean>(
        `${this.urlBase + url}`,
        formData
        // this.getHeaderFormData()
      )
    );
  }

  downloadFile(fileUrl: string) {
    return this.getResult(this.http.get(fileUrl, this.getHeaderZipBlob()));
  }

  getResult<TResponse>(
    httpMethodRequest: any
  ): Observable<TResponse> {
    return httpMethodRequest.pipe(
      map((result) => {
        this.spinnerService.hide();
        return result;
      }),
      catchError((errors) => this.serviceError(errors))
    );
  }

  getHeaderFormData() {
    // return {
    //   headers: new HttpHeaders({
    //     'Content-Type': `multipart/form-data; boundary='----WebKitFormBoundary7MA4YWxkTrZu0gW'`,
    //   }),
    // };
  }

  getHeaderBlob() {
    const httpOptions: Object = {
      observe: 'response',
      responseType: 'blob',
    };
    return httpOptions;
  }

  getHeaderJsonBlob() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const httpOptions: Object = {
      headers: headers,
      observe: 'response',
      responseType: 'blob',
    };
    return httpOptions;
  }

  getHeaderZipBlob() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/octa',
    });

    const httpOptions: Object = {
      headers: headers,
      observe: 'response',
      responseType: 'blob',
    };
    return httpOptions;
  }


  toQueryString<T>(obj: T): string {
    const keyValuePairs = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value instanceof Date) {
          const dateString = value.toISOString().slice(0, 19).replace('T', ' ');
          keyValuePairs.push(`${key}='${dateString}'`);
        } else {
          keyValuePairs.push(`${key}='${value}'`);
        }
      }
    }
    return keyValuePairs.join('&');
  }
}
