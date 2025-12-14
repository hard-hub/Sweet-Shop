import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Sweet Shop API is running' });
});

app.use('/api/auth', authRoutes);
app.use(errorHandler);

export default app;
