import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../User/user.constant';
import { BookingValidations } from './booking.validation';
import { BookingControllers } from './booking.controller';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.user),
    validateRequest(
        BookingValidations.createBookingValidationSchema
    ),
    BookingControllers.createBooking
);
router.get(
    '/',
    auth(USER_ROLE.admin),
    BookingControllers.getAllBookingOfAdmin
);

export const BookingRoutes = router;