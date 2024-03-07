import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  apiUrl: string = environment.apiUrl;

  pat: string = '';

  constructor(
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
  }

  handleLogin() {
    this.authenticationService.login(this.pat);
  }
}
