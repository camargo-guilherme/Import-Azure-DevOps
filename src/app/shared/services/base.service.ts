import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { NotificationService } from './notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export abstract class BaseService {
  public urlBase = environment.apiUrl;
  public notificationService: NotificationService;
  public spinnerService: NgxSpinnerService;

  constructor(
    notificationService: NotificationService,
    spinnerService: NgxSpinnerService
  ) {
    this.notificationService = notificationService;
    this.spinnerService = spinnerService;
  }

  // protected serviceError(error: AxiosError): AxiosError {
  //   this.spinnerService.hide();

  //   if (error.response?.data?.errors) {
  //     error.response.data?.errors.forEach((messageError: any) => {
  //       this.notificationService.notifyError(messageError);
  //     });
  //   }
  //   return error;
  // }

  protected async getResult<T>(
    requestConfig: AxiosRequestConfig,
    hide: boolean = true
  ): Promise<AxiosResponse<T>> {
    this.spinnerService.show();
    try {
      const response: AxiosResponse<T> = await axios(this.setAuthHeader(requestConfig));
      if (hide) {
        this.spinnerService.hide();
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  protected get<T>(
    url: string,
    config?: AxiosRequestConfig,
    hide?: boolean
  ): Promise<AxiosResponse<T>> {
    return this.getResult<T>(
      {
        method: 'get',
        url: `${this.urlBase}/${url}`,
        ...config,
      },
      hide,
    );
  }

  protected post<TRequest, TResponse>(
    url: string,
    data: TRequest,
    config?: AxiosRequestConfig,
    hide?: boolean
  ): Promise<AxiosResponse<TResponse>> {
    return this.getResult<TResponse>(
      {
        method: 'post',
        url: `${this.urlBase}/${url}`,
        data,
        ...config
      },
      hide,
    );
  }

  protected patch<TRequest, TResponse>(
    url: string,
    data: TRequest,
    config?: AxiosRequestConfig,
    hide?: boolean
  ): Promise<AxiosResponse<TResponse>> {
    return this.getResult<TResponse>(
      {
        method: 'patch',
        url: `${this.urlBase}/${url}`,
        data,
        ...config
      },
      hide
    );
  }

  protected put<TRequest, TResponse>(
    url: string,
    data: TRequest,
    config?: AxiosRequestConfig,
    hide?: boolean
  ): Promise<AxiosResponse<TResponse>> {
    return this.getResult<TResponse>(
      {
        method: 'put',
        url: `${this.urlBase}/${url}`,
        data,
        ...config
      },
      hide,
    );
  }

  protected delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
    hide?: boolean
  ): Promise<AxiosResponse<TResponse>> {
    return this.getResult<TResponse>(
      {
        method: 'delete',
        url: `${this.urlBase}/${url}`,
        ...config
      },
      hide,
    );
  }

  protected setAuthHeader(config?: AxiosRequestConfig): AxiosRequestConfig {
    const pat = localStorage.getItem('PAT')
    config.headers = {
      ...config.headers,
      Authorization: `Basic ${btoa(`:${pat}`)}`
    }
    return config;
  }
}
