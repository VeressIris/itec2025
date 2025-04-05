interface EventType {
  title: string;
  description: string;
  personLimit: number;
  date: Date;
  class: string;
  classTags: string[];
  grade: string;
  _id: string;
}

interface CurriculumType {
  title: string;
  summary: string;
  audio: string;
  _id: string;
}

export type { EventType, CurriculumType };
