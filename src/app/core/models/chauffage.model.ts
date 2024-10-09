export interface ChauffageResponse {
  data: ChauffageModel[];
}

export class ChauffageModel {
  name!: string;
  slug!: string;
  ecv!: number;
}
