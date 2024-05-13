import express, { Express } from "express";
import cors from 'cors';
import config from './config';
import http from 'http';
import cookieParser from 'cookie-parser';
import morganMiddleware from "./middleware/morgan";
import logger from './logger/logger';
import { WebSocket } from "./sockets/socket";
import { scheduleCronJobs } from "./middleware/transactionChat";
import { setupRoutes } from "./routes/index";
export const app: Express = express();
const server = http.createServer(app); 

app.use(cors());
app.use(express.json());
app.use(cookieParser());

WebSocket(server, app);

app.use((req, res, next) => {
  logger.http(`Request Body: ${JSON.stringify(req.body)}`);
  next();
});

app.use(morganMiddleware);

setupRoutes(app);

server.listen(config.port, () => {
  logger.info(`[server]: Server is running at http://localhost:${config.port}`);
  scheduleCronJobs();
});

