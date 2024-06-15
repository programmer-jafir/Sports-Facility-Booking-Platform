"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlwares/validateRequest"));
const auth_1 = __importDefault(require("../../middlwares/auth"));
const user_constant_1 = require("../User/user.constant");
const booking_validation_1 = require("./booking.validation");
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(booking_validation_1.BookingValidations.createBookingValidationSchema), booking_controller_1.BookingControllers.createBooking);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), booking_controller_1.BookingControllers.getAllBookingOfAdmin);
router.get('/user', (0, auth_1.default)(user_constant_1.USER_ROLE.user), booking_controller_1.BookingControllers.getAllBookingOfUser);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.user), booking_controller_1.BookingControllers.deleteBooking);
exports.BookingRoutes = router;
