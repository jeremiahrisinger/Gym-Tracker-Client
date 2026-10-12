export interface User {
  id?: string;
  username: string;
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  token?: string; 
}
