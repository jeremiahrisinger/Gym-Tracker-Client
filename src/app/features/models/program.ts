import { Exercise } from "./exercise";

export interface ProgramDay {
  _id?: string;
  exercises: Exercise[];
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  workoutCount?: number;
}

export interface Program {
  _id?: string;
  name: string;
  days: ProgramDay[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}