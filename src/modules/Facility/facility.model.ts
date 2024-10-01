import { Schema, model } from 'mongoose';
import { TFacility } from './facility.interface';

const facilitySchema = new Schema<TFacility>({
name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pricePerHour: {
    type: String,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  img: {
    type: String,
    required: true
  }
});


export const Facility = model<TFacility>('Facility', facilitySchema);

