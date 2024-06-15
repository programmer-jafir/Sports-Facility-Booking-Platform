"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidations = void 0;
const zod_1 = require("zod");
const createBookingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string().nonempty({ message: "Invalid date" }),
        startTime: zod_1.z.string().nonempty({ message: "Start time is required" }),
        endTime: zod_1.z.string().nonempty({ message: "End time is required" }),
        user: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid user ID" }).optional(),
        facility: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid facility ID" }),
        payableAmount: zod_1.z.number().min(0, { message: "Payable amount must be at least 0" }).optional(),
        isBooked: zod_1.z.enum(['confirmed', 'unconfirmed', 'canceled']).default('unconfirmed').optional()
    })
});
exports.BookingValidations = {
    createBookingValidationSchema,
};
