import express, { Request, Response } from 'express';
import notFound from './middlwares/notFound';


const app = express();  
app.get('/', (req:Request, res: Response) => {
 res.send('Hello World!')

})

//Not FOUND
app.use(notFound)

export default app;
