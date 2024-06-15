import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import mongoose from "mongoose";
import { Facility } from "../Facility/facility.model";
import QueryBuilder from "../../bilder/QueryBuilder";


const createBookingIntoDB = async ( payLoad: TBooking) =>{
  const FacilityNum = await Facility.findById(payLoad.facility).select('pricePerHour');
  // facility pricePerHour
  const pricePerHour = Number(FacilityNum.pricePerHour) ;

  // Define the start and end times
const startTime = payLoad.startTime;
const endTime = payLoad.endTime;

// Function to convert time string to minutes since midnight
function timeToMinutes(time:any) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// calculate the difference in minutes
const startMinutes = timeToMinutes(startTime);
const endMinutes = timeToMinutes(endTime);
const differenceInMinutes = endMinutes - startMinutes;

// calculate minutes to hours
const differenceInHours = differenceInMinutes / 60;
//calculate money
const Amount =  differenceInHours* pricePerHour;

payLoad.payableAmount =Amount


    const result = await Booking.create(payLoad)
    return result;
};
    const getAllBookingOfAdminIntoDB = async () =>{
        const result = await Booking.find().populate('facility').populate('user');
        return result;
    };
    const getAllBookingOfUserIntoDB = async () =>{
        const result = await Booking.find().populate('facility');
        return result;
    };

    const deleteBookingFromDB = async (id: string) => {
        const session = await mongoose.startSession();
      
        try {
          session.startTransaction();
      
          const deletedBooking = await Booking.findByIdAndUpdate(
            id,
            { isBooked: 'canceled' },
            { new: true, session },
          ).populate('facility');
      
          if (!deletedBooking) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete facility');
          }  
      
          await session.commitTransaction();
          await session.endSession();
      
          return deletedBooking;
        } catch (err: any) {
          await session.abortTransaction();
          await session.endSession();
          throw new Error(err);
        }
      };

export const BookingServices = {
    createBookingIntoDB,
    getAllBookingOfAdminIntoDB,
    getAllBookingOfUserIntoDB,
    deleteBookingFromDB,
}