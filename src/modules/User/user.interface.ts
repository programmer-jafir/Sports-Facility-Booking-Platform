export interface TUser {
    name: string;
    email: string;
    password: string; 
    phone: string;
    role: 'admin' | 'user';
    address: string;
  }

export type TLoginUser = {
  id: string;
  password: string;
}