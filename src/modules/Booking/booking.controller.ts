/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";
import { Booking } from "./booking.model";
// import { TBooking } from "./booking.interface";
import moment from "moment";
import AppError from "../../errors/AppError";
import { Facility } from "../Facility/facility.model";

const createBooking = catchAsync(async (req, res) => {

  const { facility, date, startTime, endTime } = req.body;
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

  const result = await BookingServices.createBooking(newBooking);
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

function generateAppointments(shop: any) {
  const appointments: any[] = [];
  const [hoursOp ] = shop.opens.split(":"); // Extract hours and minutes from opening time
  const [hoursCl ] = shop.closes.split(":");
  const timeRange = Number.parseInt(hoursCl) - Number.parseInt(hoursOp); // Calculate the range of hours

  for (let i = 0; i < timeRange; i++) {
      const appHourStart = Number.parseInt(hoursOp) + i;

      // Check if the appointment slots are already booked
      const firstHalfBooked = shop.appointments.some((a: { start: string; }) => a.start === `${appHourStart}:00`);
      const secondHalfBooked = shop.appointments.some((a: { start: string; }) => a.start === `${appHourStart}:30`);

      // Add slots to appointments if not booked
      if (!firstHalfBooked) appointments.push(`${appHourStart}:00 - ${appHourStart}:30`);
      if (!secondHalfBooked) appointments.push(`${appHourStart}:30 - ${appHourStart + 1}:00`);
  }

  return appointments;
}

// Updated AvailableBooking controller
const AvailableBooking = catchAsync(async (req, res) => {
  try {
      // Get the date from the query or use the current day as default
      const date = req.query.date || moment().format('YYYY-MM-DD');

      // Fetch all bookings for the given date
      const bookings = await Booking.find({ date }).exec();

      // Initialize a slot for the entire day (00:00 to 23:59)
      const dayStart = moment(date + ' 00:00', 'YYYY-MM-DD HH:mm');
      const dayEnd = moment(date + ' 23:59', 'YYYY-MM-DD HH:mm');
      let availableSlots = [{ startTime: dayStart, endTime: dayEnd }];

      // Adjust available slots based on bookings
      bookings.forEach((booking) => {
          const bookingStart = moment(date + ' ' + booking.startTime, 'YYYY-MM-DD HH:mm');
          const bookingEnd = moment(date + ' ' + booking.endTime, 'YYYY-MM-DD HH:mm');

          // Split the current available slots based on the booking range
          availableSlots = availableSlots.flatMap((slot) => {
              // If the booking doesn't overlap with the current slot, keep it as is
              if (bookingStart.isSameOrAfter(slot.endTime) || bookingEnd.isSameOrBefore(slot.startTime)) {
                  return [slot];
              }

              const newSlots = [];
              // Add the time before the booking starts
              if (bookingStart.isAfter(slot.startTime)) {
                  newSlots.push({ startTime: slot.startTime, endTime: bookingStart });
              }
              // Add the time after the booking ends
              if (bookingEnd.isBefore(slot.endTime)) {
                  newSlots.push({ startTime: bookingEnd, endTime: slot.endTime });
              }

              return newSlots;
          });
      });

      // Format the available slots for response
      const formattedSlots = availableSlots.map((slot) => ({
          startTime: slot.startTime.format('HH:mm'),
          endTime: slot.endTime.format('HH:mm'),
      }));

      // If no bookings exist, return the entire day as available
      if (bookings.length === 0) {
          formattedSlots.push({
              startTime: dayStart.format('HH:mm'),
              endTime: dayEnd.format('HH:mm'),
          });
      }

      // Example: Generate additional appointment slots for a shop
      const shop = {
          opens: '09:00',
          closes: '17:00',
          appointments: bookings.map(booking => ({ start: booking.startTime })),
      };

      const generatedAppointments = generateAppointments(shop);

      // Combine generated appointments with the formatted slots
      sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: 'Availability checked successfully',
          data: {
              availableSlots: formattedSlots,
              generatedAppointments,
          },
      });
  } catch (error) {
      // Handle errors and send a consistent error response
      sendResponse(res, {
          success: false,
          statusCode: httpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while checking availability',
          data: [],
      });
  }
});


// const AvailableBooking = catchAsync(async (req, res) => {
//   try {
//     // Get the date from the query or use the current day as default
//     const date = req.query.date || moment().format('YYYY-MM-DD');

//     // Fetch all bookings for the given date
//     const bookings = await Booking.find({ date }).exec();

//     // Initialize a slot for the entire day (00:00 to 23:59)
//     const dayStart = moment(date + ' 00:00', 'YYYY-MM-DD HH:mm');
//     const dayEnd = moment(date + ' 23:59', 'YYYY-MM-DD HH:mm');
//     let availableSlots = [{ startTime: dayStart, endTime: dayEnd }];

//     // Adjust available slots based on bookings
//     bookings.forEach((booking) => {
//       const bookingStart = moment(date + ' ' + booking.startTime, 'YYYY-MM-DD HH:mm');
//       const bookingEnd = moment(date + ' ' + booking.endTime, 'YYYY-MM-DD HH:mm');

//       // Split the current available slots based on the booking range
//       availableSlots = availableSlots.flatMap((slot) => {
//         // If the booking doesn't overlap with the current slot, keep it as is
//         if (bookingStart.isSameOrAfter(slot.endTime) || bookingEnd.isSameOrBefore(slot.startTime)) {
//           return [slot];
//         }

//         const newSlots = [];
//         // Add the time before the booking starts
//         if (bookingStart.isAfter(slot.startTime)) {
//           newSlots.push({ startTime: slot.startTime, endTime: bookingStart });
//         }
//         // Add the time after the booking ends
//         if (bookingEnd.isBefore(slot.endTime)) {
//           newSlots.push({ startTime: bookingEnd, endTime: slot.endTime });
//         }

//         return newSlots;
//       });
//     });

//     // Format the available slots for response
//     const formattedSlots = availableSlots.map((slot) => ({
//       startTime: slot.startTime.format('HH:mm'),
//       endTime: slot.endTime.format('HH:mm'),
//     }));

//     // If no bookings exist, return the entire day as available
//     if (bookings.length === 0) {
//       formattedSlots.push({
//         startTime: dayStart.format('HH:mm'),
//         endTime: dayEnd.format('HH:mm'),
//       });
//     }

//     // Send a successful response with available slots
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: 'Availability checked successfully',
//       data: formattedSlots,
//     });
//   } catch (error) {
//     // Handle errors and send a consistent error response
//     sendResponse(res, {
//       success: false,
//       statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//       message: 'An error occurred while checking availability',
//       data: [],
//     });
//   }
// });




// const AvailableBooking = catchAsync(async (req, res) => {
//   try {
//     const date = req.query.date || moment().format('YYYY-MM-DD');
    
  
//     const bookings = await Booking.find({ date }).exec();

   
//     const dayStart = moment(date + ' 00:00', 'YYYY-MM-DD HH:mm');
//     const dayEnd = moment(date + ' 23:59', 'YYYY-MM-DD HH:mm');
//     let availableSlots = [{ startTime: dayStart, endTime: dayEnd }];
    
    
//     bookings.forEach(booking => {
//       const bookingStart = moment(date + ' ' + booking.startTime, 'YYYY-MM-DD HH:mm');
//       const bookingEnd = moment(date + ' ' + booking.endTime, 'YYYY-MM-DD HH:mm');
      
//       availableSlots = availableSlots.flatMap(slot => {
//         if (bookingStart.isSameOrAfter(slot.endTime) || bookingEnd.isSameOrBefore(slot.startTime)) {
//           return [slot];
//         }

//         const newSlots = [];
//         if (bookingStart.isAfter(slot.startTime)) {
//           newSlots.push({ startTime: slot.startTime, endTime: bookingStart });
//         }
//         if (bookingEnd.isBefore(slot.endTime)) {
//           newSlots.push({ startTime: bookingEnd, endTime: slot.endTime });
//         }
        
//         return newSlots;
//       });
//     });

//     // formating the available slots
//     const formattedSlots = availableSlots.map(slot => ({
//       startTime: slot.startTime.format('HH:mm'),
//       endTime: slot.endTime.format('HH:mm')
//     }));

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: 'Availability checked successfully',
//       data: formattedSlots,
//     });
//   } catch (error) {
//     res.json({
//       success: false,
//       statusCode: 500,
//       message: 'An error occurred while checking availability',
//       data: []
//     });
//   }



// });

// try {
//   const { date, facility } = req.query;
//   const { allSlots } = req.body; // Accept slots dynamically in the request body

//   if (!date || !facility) {
//     return res.status(400).json({ message: "Date and facility are required." });
//   }

//   if (!Array.isArray(allSlots) || allSlots.length === 0) {
//     return res.status(400).json({ message: "All slots must be provided as a non-empty array." });
//   }

//   const bookings = await Booking.find({ facilityId: facility, date });

//   const bookedSlots = bookings.map((booking) => booking.timeSlots).flat();

//   const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

//   if (availableSlots.length === 0) {
//     return res.status(200).json({ message: "No slots available.", availableSlots: [] });
//   }

//   res.status(200).json({ availableSlots });
// } catch (error) {
//   console.error("Error checking availability:", error);
//   res.status(500).json({ message: "Internal server error." });
// }
export const BookingControllers = {
  createBooking,
  getAllBookingOfAdmin,
  getAllBookingOfUser,
  deleteBooking,
  AvailableBooking
}