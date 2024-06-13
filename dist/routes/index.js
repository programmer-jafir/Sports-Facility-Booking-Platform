"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/User/user.route");
const facility_route_1 = require("../modules/Facility/facility.route");
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
];
moduleRouters.forEach(route => router.use(route.path, route.route));
exports.default = router;
