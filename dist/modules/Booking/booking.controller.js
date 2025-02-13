"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingControllers = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const booking_service_1 = require("./booking.service");
const booking_model_1 = require("./booking.model");
// import { TBooking } from "./booking.interface";
const moment_1 = __importDefault(require("moment"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const facility_model_1 = require("../Facility/facility.model");
const createBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { facility, date, startTime, endTime } = req.body;
    const userId = req.user.id;
    const facilityExists = yield facility_model_1.Facility.findById(facility);
    if (!facilityExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Facility not found');
    }
    const overlappingBooking = yield booking_model_1.Booking.findOne({
        facility,
        date,
        $or: [
            { startTime: { $lt: endTime, $gt: startTime } },
            { endTime: { $lt: endTime, $gt: startTime } },
            { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
        ],
    });
    if (overlappingBooking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Facility is unavailable during the requested time slot');
    }
    const newBooking = new booking_model_1.Booking({
        facility,
        date,
        startTime,
        endTime,
        user: userId,
        payableAmount: req.body.Amount,
        isBooked: 'confirmed',
    });
    const result = yield booking_service_1.BookingServices.createBookingIntoDB(newBooking);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Booking created successfully",
        data: result
    });
}));
const getAllBookingOfAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.BookingServices.getAllBookingOfAdminIntoDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Bookings retrieved successfully",
        data: result
    });
}));
const getAllBookingOfUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.BookingServices.getAllBookingOfUserIntoDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Bookings retrieved successfully",
        data: result
    });
}));
const deleteBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield booking_service_1.BookingServices.deleteBookingFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Booking cancelled successfully',
        data: result,
    });
}));
function generateAppointments(shop) {
    const appointments = [];
    const [hoursOp] = shop.opens.split(":"); // Extract hours and minutes from opening time
    const [hoursCl] = shop.closes.split(":");
    const timeRange = Number.parseInt(hoursCl) - Number.parseInt(hoursOp); // Calculate the range of hours
    for (let i = 0; i < timeRange; i++) {
        const appHourStart = Number.parseInt(hoursOp) + i;
        // Check if the appointment slots are already booked
        const firstHalfBooked = shop.appointments.some((a) => a.start === `${appHourStart}:00`);
        const secondHalfBooked = shop.appointments.some((a) => a.start === `${appHourStart}:30`);
        // Add slots to appointments if not booked
        if (!firstHalfBooked)
            appointments.push(`${appHourStart}:00 - ${appHourStart}:30`);
        if (!secondHalfBooked)
            appointments.push(`${appHourStart}:30 - ${appHourStart + 1}:00`);
    }
    return appointments;
}
// Updated AvailableBooking controller
const AvailableBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the date from the query or use the current day as default
        const date = req.query.date || (0, moment_1.default)().format('YYYY-MM-DD');
        // Fetch all bookings for the given date
        const bookings = yield booking_model_1.Booking.find({ date }).exec();
        // Initialize a slot for the entire day (00:00 to 23:59)
        const dayStart = (0, moment_1.default)(date + ' 00:00', 'YYYY-MM-DD HH:mm');
        const dayEnd = (0, moment_1.default)(date + ' 23:59', 'YYYY-MM-DD HH:mm');
        let availableSlots = [{ startTime: dayStart, endTime: dayEnd }];
        // Adjust available slots based on bookings
        bookings.forEach((booking) => {
            const bookingStart = (0, moment_1.default)(date + ' ' + booking.startTime, 'YYYY-MM-DD HH:mm');
            const bookingEnd = (0, moment_1.default)(date + ' ' + booking.endTime, 'YYYY-MM-DD HH:mm');
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
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: 'Availability checked successfully',
            data: {
                availableSlots: formattedSlots,
                generatedAppointments,
            },
        });
    }
    catch (error) {
        // Handle errors and send a consistent error response
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: 'An error occurred while checking availability',
            data: [],
        });
    }
}));
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
exports.BookingControllers = {
    createBooking,
    getAllBookingOfAdmin,
    getAllBookingOfUser,
    deleteBooking,
    AvailableBooking
};
