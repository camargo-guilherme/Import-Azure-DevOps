import { UserStoryDTO } from "./user-story.dto";

export class FeatureDTO {
  id: string = '';
  title: string = '';
  userStories: UserStoryDTO[] = []
  parentId?: string = '';
}
