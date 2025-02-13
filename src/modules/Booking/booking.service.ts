/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import mongoose from "mongoose";
import { Facility } from "../Facility/facility.model";
// import QueryBuilder from "../../bilder/QueryBuilder";


// const createBookingIntoDB = async ( payLoad: TBooking) =>{
//   const FacilityNum : any = await Facility.findById(payLoad.facility).select('pricePerHour');
//   // facility pricePerHour
//   const pricePerHour = Number(FacilityNum.pricePerHour) ;

//   // Define the start and end times
// const startTime = payLoad.startTime;
// const endTime = payLoad.endTime;

// // Function to convert time string to minutes since midnight
// function timeToMinutes(time:any) {
//   const [hours, minutes] = time.split(':').map(Number);
//   return hours * 60 + minutes;
// }

// // calculate the difference in minutes
// const startMinutes = timeToMinutes(startTime);
// const endMinutes = timeToMinutes(endTime);
// const differenceInMinutes = endMinutes - startMinutes;

// // calculate minutes to hours
// const differenceInHours = differenceInMinutes / 60;
// //calculate money
// const Amount =  Math.abs(differenceInHours* pricePerHour);

// payLoad.payableAmount =Amount


//     const result = await Booking.create(payLoad)
//     return result;
// };
const calculatePayableAmount = async (payLoad: TBooking) => {
  const facility = await Facility.findById(payLoad.facility).select("pricePerHour");
  if (!facility) {
    throw new Error("Facility not found.");
  }

  const pricePerHour = Number(facility.pricePerHour);

  // Function to convert time string to minutes since midnight
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":" ).map(Number);
    return hours * 60 + minutes;
  };

  // Calculate the difference in minutes
  const startMinutes = timeToMinutes(payLoad.startTime);
  const endMinutes = timeToMinutes(payLoad.endTime);
  const differenceInMinutes = endMinutes - startMinutes;

  // Calculate money based on the difference in hours
  const differenceInHours = differenceInMinutes / 60;
  return Math.abs(differenceInHours * pricePerHour);
};

const createBooking = async (payLoad: TBooking) => {
  const payableAmount = await calculatePayableAmount(payLoad);
  payLoad.payableAmount = payableAmount;

  const newBooking = await Booking.create(payLoad);
  return newBooking;
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

    const checkAvailabilityFromDB = async (date: string, facilityId: string) => {
        const bookings = await Booking.find({ date, facility: facilityId });
      
        if (!bookings.length) {
          return { availableSlots: "All time slots are available." };
        }
      
        // Assuming time slots are in 1-hour intervals
        const allSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
        const bookedSlots = bookings.map((b) => b.startTime);
        const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));
      
        return availableSlots.length
          ? { availableSlots }
          : { message: "No slots available for the selected date and facility." };
      };

export const BookingServices = {
    // createBookingIntoDB,
    createBooking,
    getAllBookingOfAdminIntoDB,
    getAllBookingOfUserIntoDB,
    deleteBookingFromDB,
    checkAvailabilityFromDB
}