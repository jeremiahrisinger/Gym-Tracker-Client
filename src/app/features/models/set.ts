import { Metric } from "./metric";

export interface Set {
  _id?: number;
  setNumber: number;
  target?: Metric;
  actual?: Metric;
  completed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}