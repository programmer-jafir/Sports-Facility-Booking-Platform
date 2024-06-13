import { z } from 'zod';

const createFacilityValidationSchema = z.object({
  body: z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  pricePerHour: z.number().min(0, "Price per hour must be at least 0"),
  location: z.string().nonempty("Location is required"),
  isDeleted: z.boolean().optional().default(false),
  })
});
const updateFacilityValidationSchema = z.object({
  body: z.object({
  name: z.string().nonempty("Name is required").optional(),
  description: z.string().nonempty("Description is required").optional(),
  pricePerHour: z.number().min(0, "Price per hour must be at least 0").optional(),
  location: z.string().nonempty("Location is required").optional(),
  isDeleted: z.boolean().optional().default(false),
  })
});

export const FacilityValidations = {
    createFacilityValidationSchema,
    updateFacilityValidationSchema,
}