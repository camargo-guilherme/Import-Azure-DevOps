import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  fiveSeconds: number = 5;
  tenSeconds: number = 10;
  fifTeenSeconds: number = 15;

  constructor(private toastr: ToastrService) { }

  public notifySuccess(mensagem: string, duracao: number = this.tenSeconds * 1000) {
    this.toastr.success(mensagem, 'SUCESSO!', {
      closeButton: true,
      progressBar: true,
      timeOut: duracao
    });
  }

  public notifyInfo(mensagem: string, duracao: number = this.tenSeconds * 1000) {
    this.toastr.info(mensagem, 'AVISO!', {
      closeButton: true,
      progressBar: true,
      timeOut: duracao
    });
  }

  public notifyWarning(mensagem: string, duracao: number = this.tenSeconds * 1000) {
    this.toastr.warning(mensagem, 'ATENÇÃO!', {
      closeButton: true,
      progressBar: true,
      timeOut: duracao
    });
  }

  public notifyError(mensagem: string, duracao: number = this.fifTeenSeconds * 1000) {
    this.toastr.error(mensagem, 'ERRO!', {
      closeButton: true,
      progressBar: true,
      timeOut: duracao
    });
  }
}
