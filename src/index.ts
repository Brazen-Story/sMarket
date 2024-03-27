import express, { Express } from "express";
import cors from 'cors';
import config from './config';
import { authRoutes } from "./routes/authRoutes";
import http from 'http';
import cookieParser from 'cookie-parser';
import morganMiddleware from "./middleware/morgan";
import logger from './logger/logger';
import { userRoutes } from "./routes/userRoutes";
import { productRoutes } from "./routes/productRoutes";
import { categoryRoutes } from "./routes/categoryRoutes";
import { revievwRoutes } from "./routes/reviewRoutes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//개발 중 일때 사용
app.use((req, res, next) => {
  logger.http(`Request Body: ${JSON.stringify(req.body)}`);
  next();
});

app.use(morganMiddleware);

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/product-review', revievwRoutes);

const server = http.createServer(app);

server.listen(config.port, () => {
  logger.info(`[server]: Server is running at http://localhost:${config.port}`);
});