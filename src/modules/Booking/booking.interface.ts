import { Types } from "mongoose";

export type TBooking ={
    date: string;
    startTime: string;
    endTime: string;
    user?: Types.ObjectId; 
    userAddress?: string;
    userEmail?: string;
    userPhone?:string;
    facility: Types.ObjectId; 
    payableAmount?: number;
    isBooked?: 'confirmed' | 'unconfirmed' | 'canceled';
  }
  