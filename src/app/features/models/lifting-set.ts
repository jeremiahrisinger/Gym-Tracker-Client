export interface LiftingSet {
  _id?: number;
  exercise: string;
  weight: number;
  sets: number;
  reps: number;
  rateOfPerceivedExertion: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}
