interface EventType {
  title: string;
  description: string;
  personLimit: number;
  date: Date;
  class: string;
  classTags: string[];
  grade: string;
  _id: string;
  chatRoom: string;
  joinedBy: string[];
  addedBy: {
    clerkId: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  }; 
}


interface CurriculumType {
  title: string;
  summary: string;
  audio: string;
  _id: string;
}

export type { EventType, CurriculumType };
