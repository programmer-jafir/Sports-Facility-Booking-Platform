"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    facility: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Facility',
        required: true
    },
    payableAmount: {
        type: Number,
        required: true,
        min: 0
    },
    isBooked: {
        type: String,
        enum: ['confirmed', 'unconfirmed', 'canceled'],
        required: true,
        default: 'unconfirmed'
    }
});
// Create the Booking model
exports.Booking = (0, mongoose_1.model)('Booking', bookingSchema);
