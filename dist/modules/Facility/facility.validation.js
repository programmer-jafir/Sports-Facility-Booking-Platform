"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityValidations = void 0;
const zod_1 = require("zod");
const pricePerHourSchema = zod_1.z
    .union([zod_1.z.string().trim().min(1), zod_1.z.number().finite()])
    .transform((value) => String(value).trim())
    .refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, "Price per hour must be a non-negative number");
const createFacilityValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty("Name is required"),
        description: zod_1.z.string().nonempty("Description is required"),
        pricePerHour: pricePerHourSchema,
        location: zod_1.z.string().nonempty("Location is required"),
        isDeleted: zod_1.z.boolean().optional().default(false),
        img: zod_1.z.string().nonempty("Image is required"),
    })
});
const updateFacilityValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty("Name is required").optional(),
        description: zod_1.z.string().nonempty("Description is required").optional(),
        pricePerHour: pricePerHourSchema.optional(),
        location: zod_1.z.string().nonempty("Location is required").optional(),
        isDeleted: zod_1.z.boolean().optional(),
        img: zod_1.z.string().nonempty("Image is required").optional(),
    })
});
exports.FacilityValidations = {
    createFacilityValidationSchema,
    updateFacilityValidationSchema,
};
