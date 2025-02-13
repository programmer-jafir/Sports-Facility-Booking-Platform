import express, { Request, Response } from 'express';
import notFound from './middlwares/notFound';
import router from './routes';
import cors from 'cors';
import globalErrorHandeller from './middlwares/globalErrorhandeler';
import { BookingControllers } from './modules/Booking/booking.controller';
import cookieParser from 'cookie-parser';

const app = express();

//parsers
app.use(express.json());
app.use(cors({origin: 'https://assaginment-5.vercel.app/', credentials: true})); //
app.use(cookieParser())
//application routes
app.use('/api/', router);
app.use('/api/check-availability', BookingControllers.AvailableBooking);

app.get('/', (req:Request, res: Response) => {
 res.send('Hello World!')

})

app.use(globalErrorHandeller)

//Not FOUND
app.use(notFound)

export default app;
