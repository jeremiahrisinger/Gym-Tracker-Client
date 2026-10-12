import { LiftingSet } from "./lifting-set";

export interface Workout {
  _id?: number;
  programDayId: string;
  name: string;
  sets: LiftingSet[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}
