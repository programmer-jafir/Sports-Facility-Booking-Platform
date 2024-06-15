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
exports.BookingServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const booking_model_1 = require("./booking.model");
const mongoose_1 = __importDefault(require("mongoose"));
const facility_model_1 = require("../Facility/facility.model");
const createBookingIntoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const FacilityNum = yield facility_model_1.Facility.findById(payLoad.facility).select('pricePerHour');
    // facility pricePerHour
    const pricePerHour = Number(FacilityNum.pricePerHour);
    // Define the start and end times
    const startTime = payLoad.startTime;
    const endTime = payLoad.endTime;
    // Function to convert time string to minutes since midnight
    function timeToMinutes(time) {
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
    const Amount = Math.abs(differenceInHours * pricePerHour);
    payLoad.payableAmount = Amount;
    const result = yield booking_model_1.Booking.create(payLoad);
    return result;
});
const getAllBookingOfAdminIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.find().populate('facility').populate('user');
    return result;
});
const getAllBookingOfUserIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.find().populate('facility');
    return result;
});
const deleteBookingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const deletedBooking = yield booking_model_1.Booking.findByIdAndUpdate(id, { isBooked: 'canceled' }, { new: true, session }).populate('facility');
        if (!deletedBooking) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete facility');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return deletedBooking;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.BookingServices = {
    createBookingIntoDB,
    getAllBookingOfAdminIntoDB,
    getAllBookingOfUserIntoDB,
    deleteBookingFromDB,
};
