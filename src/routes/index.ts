import { Router } from "express";
import {  UserRouters } from "../modules/User/user.route";

const router =Router()

const moduleRouters = [
    {
        path: '/auth',
        route: UserRouters
    },
]

moduleRouters.forEach(route => router.use(route.path, route.route))

export default router;