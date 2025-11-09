export type Position = {
  id: string;
  name: string;
  grade: string;
  directSubordinates?: string[];
  jobDescription?: string;
  skFile?: string;
  memoFile?: string;
};