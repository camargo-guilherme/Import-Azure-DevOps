import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, map, throwError, Observable, from, mergeMap, toArray } from 'rxjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { BaseService } from './base.service';
import { NotificationService } from './notification.service';
import { ProjectDTO } from '../models/dtos/project.dto';
import { IterationDTO } from '../models/dtos/iteration.dto';
import { WorkItemDTO } from '../models/dtos/work-item.dto';
import { FeatureDTO } from './../models/dtos/feature.dto';
import { TaskDTO } from '../models/dtos/task.dto';
import { UserStoryDTO } from '../models/dtos/user-story.dto';
import { environment } from 'src/environments/environment';

interface Field {
  op: string,
  path: string,
  value: any,
  from?: any,
}

@Injectable({
  providedIn: 'root',
})
export class AzureDevOpsService extends BaseService {
  apiVersion = '4.1';

  constructor(
    private router: Router,
    private http: HttpClient,
    notificationService: NotificationService,
    spinnerService: NgxSpinnerService,
  ) {
    super(notificationService, spinnerService);
  }

  async getProjects(): Promise<ProjectDTO[]> {
    return this.get<any>(`_apis/projects/?api-version=${this.apiVersion}`).then(
      (result) => result.data.value
    ).catch(error => {
      console.log('getProjects', error);
      return error;
    }).finally(() => {
      this.spinnerService.hide();
    });
  }

  async getIterations(projectName: string): Promise<IterationDTO[]> {
    return this.get<any>(`${projectName}/${projectName} Team/_apis/work/teamsettings/iterations?api-version=${this.apiVersion}`).then(
      (result) => result.data.value
    ).catch(error => {
      console.log('getIterations', error);
      return error;
    }).finally(() => {
      this.spinnerService.hide();
    });
  }

  async getWorkItem(projectName: string, workItemId: string): Promise<WorkItemDTO> {
    return this.get<any>(`${projectName}/_apis/wit/workitems/${workItemId}?api-version=${this.apiVersion}`).then(
      (result) => result.data
    ).catch(error => {
      console.log('getWorkItem', error);
      return error;
    }).finally(() => {
      this.spinnerService.hide();
    });
  }

  async createWorkItems(projectName: string, iterationPath: string, featuries: FeatureDTO[]): Promise<FeatureDTO[]> {
    try {
      for (const feature of featuries) {
        feature.id;
        if (!feature.id) {
          feature.id = await this.createFeature(projectName, iterationPath, feature);
        }

        for (const userStory of feature.userStories) {
          userStory.id = await this.createUserStory(projectName, iterationPath, userStory);
          for (const task of userStory.tasks) {
            task.id = await this.createTask(projectName, iterationPath, task, userStory.id);
          }
        }
      }
      return featuries;
    } catch (error) {
      throw error;
    } finally {
      this.spinnerService.hide();
    }
  }

  private async createFeature(projectName: string, iterationPath: string, feature: FeatureDTO) {
    const data: Field[] = [
      {
        op: "add",
        path: "/fields/System.Title",
        value: feature.title,
      },
      {
        op: "add",
        path: "/fields/System.WorkItemType",
        value: "Feature",
      },
      {
        op: "add",
        path: "/fields/System.State",
        value: "New",
      },
      // {
      //   op: "add",
      //   path: "/fields/System.AssignedTo",
      //   value: assignedTo,
      // },
      {
        op: "add",
        path: "/fields/System.IterationPath",
        value: `${projectName}\\${iterationPath}`,
      },
    ];

    if (feature.parentId) {
      const field = {
        op: "add",
        path: "/relations/-",
        value: {
          rel: "System.LinkTypes.Hierarchy-Reverse",
          url: `${environment.apiUrl}/${projectName}/_apis/wit/workitems/${feature.parentId}`,
          attributes: {
            comment: "Associated with",
          },
        },
      };
      data.push(field);
    }

    return this.post<any, any>(
      `${projectName}/_apis/wit/workitems/$Feature?api-version=${this.apiVersion}`,
      data,
      {
        headers: {
          "Content-Type": "application/json-patch+json",
        }
      },
      false
    ).then(
      (result) => result.data.id
    ).catch(error => {
      console.log('createFeature', error);
      throw error;
    })
  }

  private async createUserStory(projectName: string, iterationPath: string, userStory: UserStoryDTO) {
    const data: Field[] = [
      {
        op: "add",
        path: "/fields/System.Title",
        value: userStory.title,
      },
      {
        op: "add",
        path: "/fields/System.WorkItemType",
        value: "UserStory",
      },
      {
        op: "add",
        path: "/fields/System.State",
        value: "New",
      },
      // {
      //   op: "add",
      //   path: "/fields/System.AssignedTo",
      //   value: assignedTo,
      // },
      {
        op: "add",
        path: "/fields/System.IterationPath",
        value: `${projectName}\\${iterationPath}`,
      },
    ];

    if (userStory.parentId) {
      const field = {
        op: "add",
        path: "/relations/-",
        value: {
          rel: "System.LinkTypes.Hierarchy-Reverse",
          url: `${environment.apiUrl}/${projectName}/_apis/wit/workitems/${userStory.parentId}`,
          attributes: {
            comment: "Associated with",
          },
        },
      };
      data.push(field);
    }

    return this.post<any, any>(
      `${projectName}/_apis/wit/workitems/$User%20Story?api-version=${this.apiVersion}`,
      data,
      {
        headers: {
          "Content-Type": "application/json-patch+json",
        }
      },
      false
    ).then(
      (result) => result.data.id
    ).catch(error => {
      console.log('createUserStory', error);
      throw error;
    })
  }

  private async createTask(projectName: string, iterationPath: string, task: TaskDTO, userStoryId: string) {
    const data: Field[] = [
      {
        op: "add",
        path: "/fields/System.Title",
        value: task.title,
      },
      {
        op: "add",
        path: "/fields/System.Tags",
        value: task.tags,
      },
      {
        op: "add",
        path: "/fields/Microsoft.VSTS.Scheduling.OriginalEstimate",
        from: null,
        value: task.estimate,
      },
      {
        op: "add",
        path: "/fields/Microsoft.VSTS.Scheduling.RemainingWork",
        from: null,
        value: task.remaining,
      },
      {
        op: "add",
        path: "/fields/System.WorkItemType",
        value: "Task",
      },
      {
        op: "add",
        path: "/fields/System.State",
        value: "New",
      },
      {
        op: "add",
        path: "/fields/System.AssignedTo",
        value: task.assignedTo ?? '',
      },
      {
        op: "add",
        path: "/fields/System.IterationPath",
        value: `${projectName}\\${iterationPath}`,
      },
      {
        op: "add",
        path: "/relations/-",
        value: {
          rel: "System.LinkTypes.Hierarchy-Reverse",
          url: `${environment.apiUrl}/${projectName}/_apis/wit/workitems/${userStoryId}`,
          attributes: {
            comment: "Associated with",
          },
        },
      },
    ];

    return this.post<any, any>(
      `${projectName}/_apis/wit/workitems/$Task?api-version=${this.apiVersion}`,
      data,
      {
        headers: {
          "Content-Type": "application/json-patch+json",
        }
      },
      false
    ).then(
      (result) => result.data.id
    ).catch(error => {
      console.log('createTask', error);
      throw error;
    })
  }

  private fetchWorkItems(ids: number[], projectName: string): Observable<any> {
    const batchRequests = [];
    const batchSize = 200;
    for (let i = 0; i < ids.length; i += batchSize) {
      const batchIds = ids.slice(i, i + batchSize);
      batchRequests.push(this.http.post<any>(
        `${environment.apiUrl}/${projectName}/_apis/wit/workitemsbatch?api-version=7.1-preview.1`,
        { ids: batchIds, fields: ['System.Id', 'System.WorkItemType', 'System.Title', 'System.Parent', 'System.AssignedTo', 'System.State', 'System.Tags', 'Microsoft.VSTS.Scheduling.RemainingWork', 'Microsoft.VSTS.Scheduling.CompletedWork', 'Microsoft.VSTS.Scheduling.OriginalEstimate', 'System.IterationPath'] }
      ));
    }
    return from(batchRequests).pipe(
      mergeMap(req => req),
      toArray(),
      map(responses => responses.flatMap(response => response))
    );
  }

  private fetchParentTitles(parentIds: number[], projectName: string): Observable<any> {
    if (parentIds.length === 0) return from([{}]);
    return this.fetchWorkItems(parentIds, projectName).pipe(
      map(parentWorkItemsList => {
        const parentTitles: { [key: number]: string } = {};

        let parentWorkItems: any[] = [];

        for (let parentWorkItem of parentWorkItemsList) {
          parentWorkItems = [...parentWorkItem.value];
        }

        parentWorkItems.forEach((item: any) => {
          parentTitles[item.id] = item.fields['System.Title'];
        });
        return parentTitles;
      })
    );
  }

  getWorkItems(projectName: string): Observable<any> {
    const wiqlQuery = {
      query: `
        SELECT
          [System.Id],
          [System.WorkItemType],
          [System.Title],
          [System.Parent],
          [System.AssignedTo],
          [System.State],
          [System.Tags],
          [Microsoft.VSTS.Scheduling.RemainingWork],
          [Microsoft.VSTS.Scheduling.CompletedWork],
          [Microsoft.VSTS.Scheduling.OriginalEstimate],
          [System.IterationPath]
        FROM workitems
        WHERE
          [System.TeamProject] = '${projectName}'
          AND [System.WorkItemType] = 'Task'
          AND [System.State] <> ''
      `
    };

    return this.http.post<any>(`${environment.apiUrl}/${projectName}/_apis/wit/wiql?timePrecision=true&api-version=7.1-preview.2`, wiqlQuery)
      .pipe(
        map((response: any) => response?.workItems.map((wi: any) => wi.id)),
        mergeMap((ids: any) => this.fetchWorkItems(ids, projectName)),
        mergeMap((workItemsList: any) => {
          let workItems: any[] = [];

          for (let workItemList of workItemsList) {
            workItems = [...workItemList.value];
          }

          const parentIds: number[] = Array.from(new Set(workItems.map((item: any) => item.fields['System.Parent']).filter((id: any) => +id)));
          return this.fetchParentTitles(parentIds, projectName).pipe(
            map(parentTitles => ({ workItems, parentTitles }))
          );
        }),
        map(({ workItems, parentTitles }) => {
          return workItems.map((item: any) => ({
            Id: item.id,
            WorkItemType: item.fields['System.WorkItemType'],
            Title: item.fields['System.Title'],
            ParentId: item.fields['System.Parent'],
            ParentTitle: parentTitles[item.fields['System.Parent']] || 'No Parent',
            AssignedTo: item.fields['System.AssignedTo']?.displayName || '',
            State: item.fields['System.State'],
            Tags: item.fields['System.Tags'],
            RemainingWork: item.fields['Microsoft.VSTS.Scheduling.RemainingWork'],
            CompletedWork: item.fields['Microsoft.VSTS.Scheduling.CompletedWork'],
            OriginalEstimate: item.fields['Microsoft.VSTS.Scheduling.OriginalEstimate'],
            IterationPath: item.fields['System.IterationPath']
          }));
        })
      );
  }

  getAllWorkItems(projectName: string) {
    return this.getWorkItems(projectName);
  }

  downloadWorkItems(workItemsList: any[]): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(workItemsList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'WorkItems');
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'work_items.xlsx');
  }
}
