"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notFound_1 = __importDefault(require("./middlwares/notFound"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const globalErrorhandeler_1 = __importDefault(require("./middlwares/globalErrorhandeler"));
const booking_controller_1 = require("./modules/Booking/booking.controller");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true })); //
app.use((0, cookie_parser_1.default)());
//application routes
app.use('/api/', routes_1.default);
app.use('/api/check-availability', booking_controller_1.BookingControllers.AvailableBooking);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(globalErrorhandeler_1.default);
//Not FOUND
app.use(notFound_1.default);
exports.default = app;
