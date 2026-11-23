"use strict";
// import express, { Request, Response } from 'express';
// import notFound from './middlwares/notFound';
// import router from './routes';
// import cors from 'cors';
// import globalErrorHandeller from './middlwares/globalErrorhandeler';
// import { BookingControllers } from './modules/Booking/booking.controller';
// import cookieParser from 'cookie-parser';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app = express();
// //parsers
// app.use(express.json());
// app.use(cors({origin: 'https://assaginment-5.vercel.app', credentials: true})); // http://localhost:5173 
// app.use(cookieParser())
// //application routes
// app.use('/api/', router);
// app.use('/api/check-availability', BookingControllers.AvailableBooking);
// app.get('/', (req:Request, res: Response) => {
//  res.send('Hello World!')
// })
// app.use(globalErrorHandeller)
// //Not FOUND
// app.use(notFound)
// export default app;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notFound_1 = __importDefault(require("./middlwares/notFound"));
const routes_1 = __importDefault(require("./routes"));
const globalErrorhandeler_1 = __importDefault(require("./middlwares/globalErrorhandeler"));
const booking_controller_1 = require("./modules/Booking/booking.controller");
const app = (0, express_1.default)();
const corsOptions = {
    origin: [
        "https://assaginment-5.vercel.app",
        "http://localhost:5173",
    ],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// app.options("*", cors(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Application routes
app.use("/api/check-availability", booking_controller_1.BookingControllers.AvailableBooking);
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use(globalErrorhandeler_1.default);
app.use(notFound_1.default);
exports.default = app;
