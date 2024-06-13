"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityValidations = void 0;
const zod_1 = require("zod");
const createFacilityValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty("Name is required"),
        description: zod_1.z.string().nonempty("Description is required"),
        pricePerHour: zod_1.z.number().min(0, "Price per hour must be at least 0"),
        location: zod_1.z.string().nonempty("Location is required"),
        isDeleted: zod_1.z.boolean().optional().default(false),
    })
});
const updateFacilityValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty("Name is required").optional(),
        description: zod_1.z.string().nonempty("Description is required").optional(),
        pricePerHour: zod_1.z.number().min(0, "Price per hour must be at least 0").optional(),
        location: zod_1.z.string().nonempty("Location is required").optional(),
        isDeleted: zod_1.z.boolean().optional().default(false),
    })
});
exports.FacilityValidations = {
    createFacilityValidationSchema,
    updateFacilityValidationSchema,
};
