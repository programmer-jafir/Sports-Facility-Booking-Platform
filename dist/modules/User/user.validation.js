"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = exports.createUserValidation = void 0;
const zod_1 = require("zod");
exports.createUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        _id: zod_1.z.string().optional(),
        name: zod_1.z.string(),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
        phone: zod_1.z.string(),
        role: zod_1.z.enum(['admin', 'user']),
        address: zod_1.z.string(),
    })
});
exports.UserValidation = {
    createUserValidation: exports.createUserValidation
};
