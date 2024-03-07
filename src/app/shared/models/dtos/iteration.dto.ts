export class IterationDTO {
  id: string = '';
  attributes: AttributesDTO[] = []
  name: string = '';
  path: string = '';
  url: string = '';
}

export class AttributesDTO {
  finishDate?: Date;
  startDate?: Date;
  timeFram: string = '';
}
