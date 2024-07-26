import { Component, OnInit } from '@angular/core';

import { IterationDTO } from 'src/app/shared/models/dtos/iteration.dto';
import { ProjectDTO } from 'src/app/shared/models/dtos/project.dto';
import { FeatureDTO } from 'src/app/shared/models/dtos/feature.dto';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { AzureDevOpsService } from 'src/app/shared/services/azure-devops.service';
import { ImportXlsxService } from 'src/app/shared/services/import-xlsx.service';
import { NotificationService } from 'src/app/shared/services/notification.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  projects: ProjectDTO[] = [];
  projectSelected: string = '';
  workItemsList: any[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private azureDevOpsService: AzureDevOpsService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.authenticationService.validateSession().then(result => {
      this.handleProjects();
    });
  }

  async handleProjects() {
    const projects = await this.azureDevOpsService.getProjects();
    this.projects = projects;
  }

  getAllWorkList() {
    this.azureDevOpsService.getAllWorkItems(this.projectSelected).subscribe(workItemsList => {
      this.workItemsList = workItemsList;
    })
  }

  handleDownloadXlsx() {
    this.azureDevOpsService.downloadWorkItems(this.workItemsList);
  }
}
