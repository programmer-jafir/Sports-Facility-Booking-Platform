import { Schema, model } from 'mongoose';
import { TBooking } from './booking.interface';
import { string } from 'zod';


const bookingSchema = new Schema<TBooking>({
  date: {
    type: String,
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    unique:true,
  },
  facility: {
    type: Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  payableAmount: {
    type: Number,
    required: false,
    min: 0
  },
  isBooked: {
    type: String,
    enum: ['confirmed', 'unconfirmed', 'canceled'],
    required: true,
    default: 'confirmed'
  }
});

// Create the Booking model
export const Booking = model<TBooking>('Booking', bookingSchema);
