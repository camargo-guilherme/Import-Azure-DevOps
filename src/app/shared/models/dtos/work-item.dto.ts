export class WorkItemDTO {
  id: string = '';
  rev: string = '';
  fields: WorkItemFieldDTO = new WorkItemFieldDTO();
  url: string = ""
}

class WorkItemFieldDTO {
  "System.AreaPath": string = '';
  "System.TeamProject": string = '';
  "System.IterationPath": string = '';
  "System.WorkItemType": string = '';
  "System.State": string = '';
  "System.Reason": string = '';
  "System.CreatedDate": string = '';
  "System.CreatedBy": string = '';
  "System.ChangedDate": string = '';
  "System.ChangedBy": string = '';
  "System.CommentCount": number = 0;
  "System.Title": string = '';
  "System.BoardColumn": string = '';
  "System.BoardColumnDone": boolean = false;
  "Microsoft.VSTS.Common.StateChangeDate": string = '';
  "Microsoft.VSTS.Common.ActivatedDate": string = '';
  "Microsoft.VSTS.Common.ActivatedBy": string = '';
  "Microsoft.VSTS.Common.Priority": number = 0;
  "Microsoft.VSTS.Common.StackRank": number = 0;
  "Microsoft.VSTS.Common.ValueArea": string = '';
  "System.Description": string = '';
  "System.Tags": string = '';
}
