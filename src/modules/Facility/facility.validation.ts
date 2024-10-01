import { z } from 'zod';

const createFacilityValidationSchema = z.object({
  body: z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  pricePerHour: z.string().min(0, "Price per hour must be at least 0"),
  location: z.string().nonempty("Location is required"),
  isDeleted: z.boolean().optional().default(false),
  img: z.string().nonempty("Image is required"),
  })
});
const updateFacilityValidationSchema = z.object({
  body: z.object({
  name: z.string().nonempty("Name is required").optional(),
  description: z.string().nonempty("Description is required").optional(),
  pricePerHour: z.string().min(0, "Price per hour must be at least 0").optional(),
  location: z.string().nonempty("Location is required").optional(),
  isDeleted: z.boolean().optional().default(false),
  img: z.string().nonempty("Image is required").optional(),
  })
});

export const FacilityValidations = {
    createFacilityValidationSchema,
    updateFacilityValidationSchema,
}