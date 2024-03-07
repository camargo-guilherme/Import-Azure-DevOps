import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout-pages',
  templateUrl: './layout-pages.component.html',
  styleUrls: ['./layout-pages.component.scss'],
})
export class LayoutPagesComponent implements OnInit {
  viewFullSidebar: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() { }

  toogleSidebar(event: any) {
    this.viewFullSidebar = !this.viewFullSidebar;
  }
}
