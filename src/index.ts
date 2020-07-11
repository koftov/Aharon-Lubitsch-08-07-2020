import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';

import { requestLoggerMiddleware } from './middlewares/request.logger.middleware';
import taskRoutes from './routes/tasks';
import userRoutes from './routes/users';

// initialize app
const app: express.Application = express();

require('./db');

// middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(requestLoggerMiddleware);

// routes
app.use(taskRoutes);
app.use(userRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT: string | number = process.env.PORT || 5000;

// Starting the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
