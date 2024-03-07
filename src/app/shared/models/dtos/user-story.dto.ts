import { TaskDTO } from "./task.dto";

export class UserStoryDTO {
  id: string = '';
  title: string = '';
  tasks: TaskDTO[] = []
  parentId?: string = '';
}
