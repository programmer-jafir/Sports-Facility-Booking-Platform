"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/User/user.route");
const facility_route_1 = require("../modules/Facility/facility.route");
const booking_route_1 = require("../modules/Booking/booking.route");
const router = (0, express_1.Router)();
const moduleRouters = [
    {
        path: '/auth',
        route: user_route_1.UserRouters
    },
    {
        path: '/facility',
        route: facility_route_1.FacilityRoutes
    },
    {
        path: '/bookings',
        route: booking_route_1.BookingRoutes
    },
];
moduleRouters.forEach(route => router.use(route.path, route.route));
exports.default = router;
