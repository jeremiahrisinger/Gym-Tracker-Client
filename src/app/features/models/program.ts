import { LiftingSet } from "./lifting-set";
import { Workout } from "./workout";

export interface ProgramSet {
  _id?: string;
  liftingSet: LiftingSet;
  setIncrement: number;
  repIncrement: number;
  weightIncrement: number;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface ProgramDay {
  _id?: String;
  name: string;
  programSets: ProgramSet[];
  completionCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface Program {
  _id?: string;
  name: string;
  programDays: ProgramDay[];
  programLength: number;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}