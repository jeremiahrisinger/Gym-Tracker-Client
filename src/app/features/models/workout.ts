import { Exercise } from "./exercise";

export interface Workout {
  _id?: string;
  programDayId?: string;
  exercises: Exercise[];
  name: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}
