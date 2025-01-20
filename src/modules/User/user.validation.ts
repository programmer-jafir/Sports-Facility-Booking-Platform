import { z } from "zod";


export const createUserValidation = z.object({
    body: z.object({
        _id: z.string().optional(),
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        phone: z.string(),
        role: z.enum(['admin', 'user']),
        address: z.string(),
    })
});

export const UserValidation = {
    createUserValidation
}