import express, { Express, Request, Response } from "express";
import cors from 'cors';
import config from './config';
import { authRoutes } from "./routes/authRoutes";
import http from 'http';
import cookieParser from 'cookie-parser';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use('/auth', authRoutes);

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`[server]: Server is running at http://localhost:${config.port}`);
});