import { Set } from "./set";

export interface Exercise {
  _id?: number;
  name: string;
  sets: Set[];
  createdAt: Date;
  updatedAt: Date;
}