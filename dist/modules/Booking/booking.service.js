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
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const booking_model_1 = require("./booking.model");
const mongoose_1 = __importDefault(require("mongoose"));
const facility_model_1 = require("../Facility/facility.model");
// import { initiatePayment } from "../payment/payment.utils";
// import { initiatePayment } from "../payment/payment.utils";
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
const calculatePayableAmount = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const facility = yield facility_model_1.Facility.findById(payLoad.facility).select("pricePerHour");
    if (!facility) {
        throw new Error("Facility not found.");
    }
    const pricePerHour = Number(facility.pricePerHour);
    // Function to convert time string to minutes since midnight
    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };
    // Calculate the difference in minutes
    const startMinutes = timeToMinutes(payLoad.startTime);
    const endMinutes = timeToMinutes(payLoad.endTime);
    const differenceInMinutes = endMinutes - startMinutes;
    // Calculate money based on the difference in hours
    const differenceInHours = differenceInMinutes / 60;
    return Math.abs(differenceInHours * pricePerHour);
});
const createBooking = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const payableAmount = yield calculatePayableAmount(payLoad);
    payLoad.payableAmount = payableAmount;
    // const transactionId = `TXN-${Date.now()}`;
    const newBooking = yield booking_model_1.Booking.create(payLoad);
    // const paymentSession = await initiatePayment({
    //   ...payLoad,
    //   user: payLoad.user, // Ensure user details are available
    // });
    // return { newBooking, paymentUrl: paymentSession.payment_url };
    // await newBooking.save(),
    // const paymentData= {
    //   transactionId,
    //   payableAmount,
    //   customerName: user.name,
    //   customerPhone: user.phone,
    //   customerEmail: user.email,
    //   customerAddress: user.address,
    // }
    // payment 
    //  const paymentSession = await initiatePayment(paymentData);
    // console.log(paymentSession)
    return newBooking;
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
const checkAvailabilityFromDB = (date, facilityId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookings = yield booking_model_1.Booking.find({ date, facility: facilityId });
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
});
exports.BookingServices = {
    // createBookingIntoDB,
    createBooking,
    getAllBookingOfAdminIntoDB,
    getAllBookingOfUserIntoDB,
    deleteBookingFromDB,
    checkAvailabilityFromDB
};
