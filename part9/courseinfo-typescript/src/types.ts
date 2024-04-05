export interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

export interface CourtPartBaseDescription extends CoursePartBase {
  description: string;
}

export interface CoursePartBasic extends CourtPartBaseDescription {
  kind: 'basic';
}

export interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: 'group';
}

export interface CoursePartBackground extends CourtPartBaseDescription {
  backgroundMaterial: string;
  kind: 'background';
}

export interface CoursePartSpecial extends CourtPartBaseDescription {
  requirements: string[];
  kind: 'special';
}

export type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

export interface HeaderProps {
  name: string;
}

export interface ContentProps {
  courseParts: CoursePart[];
}

export interface TotalProps {
  totalExercises: number;
}

export interface PartProps {
  part: CoursePart;
}
