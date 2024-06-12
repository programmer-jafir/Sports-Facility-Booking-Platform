import express from 'express'
import validateRequest from '../../middlwares/validateRequest';
import { AuthValidation } from '../Auth/auth.validation';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router.post(
    '/login',
    validateRequest(AuthValidation.loginValidationSchema),
    UserControllers.loginUser,
);
router.post(
    '/signup',
    validateRequest(UserValidation.createUserValidation),
    UserControllers.createUserSignUp,
);

export const UserRouters = router;