import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Facility } from "../Facility/facility.model";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import mongoose from "mongoose";


const createBookingIntoDB = async ( payLoad: TBooking) =>{
    
  /*
      const facility = payLoad?.facility;
    const facilityIsDeleted = payLoad?.facility;
    // check if the facility is exist
    const isFacilityExists = 
    await Facility.findById(facility);

    if(! isFacilityExists){
        throw new AppError(httpStatus.NOT_FOUND,'This facility is not found')
    }

    const result = await Booking.create(payLoad);
    return result;
  */

 
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
    deleteBookingFromDB
}