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
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const booking_service_1 = require("./booking.service");
const booking_model_1 = require("./booking.model");
const moment_1 = __importDefault(require("moment"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const facility_model_1 = require("../Facility/facility.model");
const createBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { facility, date, startTime, endTime, user } = req.body;
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
const AvailableBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = req.query.date || (0, moment_1.default)().format('YYYY-MM-DD');
        const bookings = yield booking_model_1.Booking.find({ date }).exec();
        const dayStart = (0, moment_1.default)(date + ' 00:00', 'YYYY-MM-DD HH:mm');
        const dayEnd = (0, moment_1.default)(date + ' 23:59', 'YYYY-MM-DD HH:mm');
        let availableSlots = [{ startTime: dayStart, endTime: dayEnd }];
        bookings.forEach(booking => {
            const bookingStart = (0, moment_1.default)(date + ' ' + booking.startTime, 'YYYY-MM-DD HH:mm');
            const bookingEnd = (0, moment_1.default)(date + ' ' + booking.endTime, 'YYYY-MM-DD HH:mm');
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
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: 'Availability checked successfully',
            data: formattedSlots,
        });
    }
    catch (error) {
        res.json({
            success: false,
            statusCode: 500,
            message: 'An error occurred while checking availability',
            data: []
        });
    }
}));
exports.BookingControllers = {
    createBooking,
    getAllBookingOfAdmin,
    getAllBookingOfUser,
    deleteBooking,
    AvailableBooking
};
