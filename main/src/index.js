import express from 'express';
import {PORT} from './config.js'
import {router as booksRouter} from './routes/booksRouter.js'
import {router as userRouter} from './routes/userRouter.js'
import {router as mainRouter} from './routes/index.js'
import {router as apiRouter} from './routes/apiRouter.js'
import {logger} from './middleware/logger.js'
import {error as error404} from './middleware/err-404.js'
import { dirname } from 'path';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use('/load', express.static(path.join(__dirname, '..', 'load')));

app.use(logger);

app.use('/', mainRouter);
app.use('/api/books', booksRouter);
app.use('/api/user', userRouter);
app.use('/api', apiRouter);

app.use(error404);

app.listen(PORT);
