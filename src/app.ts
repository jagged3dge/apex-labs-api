import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import labResultsRouter from './routes/labResults';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/labs', labResultsRouter);

// Error handling
app.use(errorHandler);

export default app;
