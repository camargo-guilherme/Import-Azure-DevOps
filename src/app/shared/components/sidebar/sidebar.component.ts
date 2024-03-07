import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import packageJson from 'package.json';

import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../services/authentication.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SideBarComponent implements OnInit {
  version: string = packageJson.version;

  @Input()
  viewFullSidebar: boolean = true;

  @Output()
  toogle = new EventEmitter();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() { }

  toogleSidebar() {
    this.viewFullSidebar = !this.viewFullSidebar;
    this.toogle.emit(this.viewFullSidebar);
  }

  handleLogout() {
    this.authenticationService.logout();
  }
}
