export interface Question {
  content: string;
  options: string[];
  correctOptionIndex: number;
  order?: number;
}

// export const CourseStatusList = ["draft", "published", "closed"] as const;

// export type CourseStatus = (typeof CourseStatusList)[number];

export type QuizStatus = "draft" | "published" | "closed";

export type QuizStatusWithAll = QuizStatus | "all";

export const QUIZ_STATUS_OPTIONS: {
  label: string;
  value: QuizStatusWithAll;
}[] = [
  { label: "All", value: "all" },
  { label: "draft", value: "draft" },
  { label: "published", value: "published" },
  { label: "closed", value: "closed" },
];

export interface Quiz {
  id: string;
  title: string;
  class_id: string;
  thumbnail_id?: string;
  description?: string;
  questions: Question[];
  totalScore?: number;
  duration: number;
  status?: QuizStatus;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;

  thumbnailUrl?: string;
}
