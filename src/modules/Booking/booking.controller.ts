import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";
import { Booking } from "./booking.model";
import { TBooking } from "./booking.interface";

const createBooking = catchAsync(async(req,res)=>{
  /*
    const {...userData} = req.body;

    const {startTime,endTime,date,facility, user} = req.body;

    // Function to calculate payable amount
const calculatePayableAmount = (startTime: string, endTime: string, date: string, pricePerHour: number): number => {
    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);
  
    // Calculate difference in hours
    const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return diffInHours * pricePerHour;
  };
  const userId = req.user.id;

  const existingBookings = await Booking.find({
    facility: facility,
    date: date,
    $or: [
      { startTime: { $lt: endTime, $gt: startTime } },
      { endTime: { $gt: startTime, $lt: endTime } }
    ]
  });

   // Example price per hour
   const pricePerHour = 30;  // Set the price per hour here

   // Calculate payable amount
   const payableAmount = calculatePayableAmount(startTime, endTime, date, pricePerHour);




   // Create and save the booking
   const bookingData: TBooking = {
     ...req.body,
     user: userId,
     payableAmount,
   };


   const booking = new Booking(bookingData);
   await booking.save();
    // creating booking
    const result  = await BookingServices.createBookingIntoDB(req.body ,userData);

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Booking created successfully",
        data: booking
    })
        */
});

const getAllBookingOfAdmin = catchAsync(async(req,res)=>{

  const result  = await BookingServices.getAllBookingOfAdminIntoDB();
  
  sendResponse(res,{
      success: true,
      statusCode: httpStatus.OK,
      message: "Bookings retrieved successfully",
      data: result
  })
})

export const BookingControllers = {
    createBooking,
    getAllBookingOfAdmin
}