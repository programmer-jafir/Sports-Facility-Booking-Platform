import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";
import { Booking } from "./booking.model";
import { TBooking } from "./booking.interface";
import moment from "moment";
import AppError from "../../errors/AppError";
import { Facility } from "../Facility/facility.model";

const createBooking = catchAsync(async (req, res) => {

  const { facility, date, startTime, endTime, user } = req.body;
  const userId = req.user.id;

  const facilityExists = await Facility.findById(facility);
  if (!facilityExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility not found');
  }
  const overlappingBooking = await Booking.findOne({
    facility,
    date,
    $or: [
      { startTime: { $lt: endTime, $gt: startTime } },
      { endTime: { $lt: endTime, $gt: startTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
    ],
  });
  
  if (overlappingBooking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility is unavailable during the requested time slot')
  }

  
  const newBooking = new Booking({
    facility,
    date,
    startTime,
    endTime,
    user: userId,
    payableAmount: req.body.Amount,
    isBooked: 'confirmed',
  });

  const result = await BookingServices.createBookingIntoDB(newBooking);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking created successfully",
    data: result
  })

});

const getAllBookingOfAdmin = catchAsync(async (req, res) => {

  const result = await BookingServices.getAllBookingOfAdminIntoDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
    data: result
  })
})
const getAllBookingOfUser = catchAsync(async (req, res) => {

  const result = await BookingServices.getAllBookingOfUserIntoDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
    data: result
  })
});

const deleteBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingServices.deleteBookingFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking cancelled successfully',
    data: result,
  });
});

const AvailableBooking = catchAsync(async (req, res) => {
  try {
    const date = req.query.date || moment().format('YYYY-MM-DD');
    
  
    const bookings = await Booking.find({ date }).exec();

   
    const dayStart = moment(date + ' 00:00', 'YYYY-MM-DD HH:mm');
    const dayEnd = moment(date + ' 23:59', 'YYYY-MM-DD HH:mm');
    let availableSlots = [{ startTime: dayStart, endTime: dayEnd }];
    
    
    bookings.forEach(booking => {
      const bookingStart = moment(date + ' ' + booking.startTime, 'YYYY-MM-DD HH:mm');
      const bookingEnd = moment(date + ' ' + booking.endTime, 'YYYY-MM-DD HH:mm');
      
      availableSlots = availableSlots.flatMap(slot => {
        if (bookingStart.isSameOrAfter(slot.endTime) || bookingEnd.isSameOrBefore(slot.startTime)) {
          return [slot];
        }

        const newSlots = [];
        if (bookingStart.isAfter(slot.startTime)) {
          newSlots.push({ startTime: slot.startTime, endTime: bookingStart });
        }
        if (bookingEnd.isBefore(slot.endTime)) {
          newSlots.push({ startTime: bookingEnd, endTime: slot.endTime });
        }
        
        return newSlots;
      });
    });

    // formating the available slots
    const formattedSlots = availableSlots.map(slot => ({
      startTime: slot.startTime.format('HH:mm'),
      endTime: slot.endTime.format('HH:mm')
    }));

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Availability checked successfully',
      data: formattedSlots,
    });
  } catch (error) {
    res.json({
      success: false,
      statusCode: 500,
      message: 'An error occurred while checking availability',
      data: []
    });
  }
});

export const BookingControllers = {
  createBooking,
  getAllBookingOfAdmin,
  getAllBookingOfUser,
  deleteBooking,
  AvailableBooking
}