import { z } from 'zod';

const pricePerHourSchema = z
  .union([z.string().trim().min(1), z.number().finite()])
  .transform((value) => String(value).trim())
  .refine(
    (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
    "Price per hour must be a non-negative number",
  );

const createFacilityValidationSchema = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().nonempty("Description is required"),
    pricePerHour: pricePerHourSchema,
    location: z.string().nonempty("Location is required"),
    isDeleted: z.boolean().optional().default(false),
    img: z.string().nonempty("Image is required"),
  })
});
const updateFacilityValidationSchema = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required").optional(),
    description: z.string().nonempty("Description is required").optional(),
    pricePerHour: pricePerHourSchema.optional(),
    location: z.string().nonempty("Location is required").optional(),
    isDeleted: z.boolean().optional(),
    img: z.string().nonempty("Image is required").optional(),
  })
});

export const FacilityValidations = {
    createFacilityValidationSchema,
    updateFacilityValidationSchema,
}