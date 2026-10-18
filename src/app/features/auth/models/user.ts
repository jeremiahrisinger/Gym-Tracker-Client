export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  token?: string; 
}
