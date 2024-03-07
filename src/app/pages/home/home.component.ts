import { Component, OnInit } from '@angular/core';

import { IterationDTO } from 'src/app/shared/models/dtos/iteration.dto';
import { ProjectDTO } from 'src/app/shared/models/dtos/project.dto';
import { UserStoryDTO } from 'src/app/shared/models/dtos/user-story.dto';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { AzureDevOpsService } from 'src/app/shared/services/azure-devops.service';
import { ImportXlsxService } from 'src/app/shared/services/import-xlsx.service';
import { NotificationService } from 'src/app/shared/services/notification.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  projects: ProjectDTO[] = [];
  iterations: IterationDTO[] = [];
  userStories: UserStoryDTO[] = [];
  projectSelected: string = '';
  iterationSelected: string = '';
  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file: File | null = null; // Variable to store file

  constructor(
    private authenticationService: AuthenticationService,
    private azureDevOpsService: AzureDevOpsService,
    private notificationService: NotificationService,
    private importXlsxService: ImportXlsxService
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

  async handleIterations() {
    const iterations = await this.azureDevOpsService.getIterations(this.projectSelected);
    this.iterations = iterations;
  }

  async handleCreateWorkItems() {
    this.azureDevOpsService.createWorkItems(
      this.projectSelected,
      this.iterationSelected,
      this.userStories
    ).then(result => {
      this.userStories = result;

      this.notificationService.notifySuccess('Importação realizado com sucesso');

      this.handleClearSelections();
    }).catch(error => {
      this.notificationService.notifyError('Falha ao realizar importação');
    });
  }

  handleRemoveTask(indexUserStory: number, indexTask: number) {
    const userStory = this.userStories[indexUserStory];
    userStory.tasks.splice(indexTask, 1);

    this.userStories[indexUserStory] = userStory;
  }

  // On file Select
  async onChange(event: any) {
    const file: File = event.target.files[0];

    if (file && this.projectSelected) {
      // we will implement this method later
      this.file = file
      this.userStories = await this.importXlsxService.handleImportXLSX(this.projectSelected, file);
    }
  }

  handleClearSelections() {
    this.projectSelected = this.iterationSelected = '';
    this.file = undefined;
  }
}
