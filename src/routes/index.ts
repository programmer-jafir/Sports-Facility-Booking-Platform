import { Router } from "express";
import {  UserRouters } from "../modules/User/user.route";
import { FacilityRoutes } from "../modules/Facility/facility.route";
import { BookingRoutes } from "../modules/Booking/booking.route";

const router =Router()

const moduleRouters = [
    {
        path: '/auth',
        route: UserRouters
    },
    {
        path: '/facility',
        route: FacilityRoutes
    },
    {
        path: '/bookings',
        route: BookingRoutes
    },
]

moduleRouters.forEach(route => router.use(route.path, route.route))

export default router;