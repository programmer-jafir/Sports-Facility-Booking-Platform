import express, { Request, Response } from 'express';
import notFound from './middlwares/notFound';
import router from './routes';
import cors from 'cors';


const app = express();

//parsers
app.use(express.json());
app.use(cors());

//application routes
app.use('/api/', router);

app.get('/', (req:Request, res: Response) => {
 res.send('Hello World!')

})

//Not FOUND
app.use(notFound)

export default app;
