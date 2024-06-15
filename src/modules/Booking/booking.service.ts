import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Facility } from "../Facility/facility.model";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";


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

export const BookingServices = {
    createBookingIntoDB,
    getAllBookingOfAdminIntoDB
}