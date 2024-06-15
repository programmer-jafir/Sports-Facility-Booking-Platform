import { z } from "zod";

const createBookingValidationSchema = z.object({
   body: z.object({
    date: z.string().nonempty({message: "Invalid date"}),
      startTime: z.string().nonempty({ message: "Start time is required" }),
      endTime: z.string().nonempty({ message: "End time is required" }),
      user: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid user ID" }).optional(),
      facility: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid facility ID" }),
      payableAmount: z.number().min(0, { message: "Payable amount must be at least 0" }).optional(),
      isBooked: z.enum(['confirmed', 'unconfirmed', 'canceled']).default('unconfirmed').optional()
   })
  });

export const BookingValidations = {
    createBookingValidationSchema,
}