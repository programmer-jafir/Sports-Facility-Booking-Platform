import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
    toObject(): { [x: string]: any; password: any; };
    _id?:string;
    name: string;
    email: string;
    password: string; 
    phone: string;
    role: 'admin' | 'user';
    address: string;
  }

export type TLoginUser = {
  email: string;
  password: string;
}

export interface UserModel extends Model<TUser>{
  isUserExistsByCustomEmail(email: string) : Promise<TUser>;
  isPasswordMatched(planeTextPassword: string, hashTextPassword: string) : Promise<boolean>;

};

export type TUserRole = keyof typeof USER_ROLE;

