import express, { Application, NextFunction } from 'express';
import connectToMongoDb from './frameworks/database/mongodb/connection';
import http from 'http';
import serverConfig from './frameworks/webserver/server';
import expressConfig from './frameworks/webserver/express';
import routes from './frameworks/webserver/routes';
import connection from './frameworks/database/redis/connection';
import colors from 'colors.ts';
import errorHandlingMiddleware from './frameworks/webserver/middlewares/errorHandling';
import configKeys from './config'; 
import AppError from './utils/appError';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './types/socketInterfaces';
import { Server } from 'socket.io';
import socketConfig from './frameworks/websocket/socket';
import { authService } from './frameworks/services/authService';

colors?.enable();

const app: Application = express();
const server = http.createServer(app);

const io = new Server<ClientToServerEvents,ServerToClientEvents,InterServerEvents,SocketData>(server,{
  cors:{
      origin:configKeys.ORIGIN_PORT,
      methods:["GET","POST"]
  } 
});

socketConfig(io,authService())  

connectToMongoDb();

const redisClient = connection().createRedisClient();

expressConfig(app);

routes(app, redisClient); 

// Move the catch-all route BEFORE error handling middleware
app.all('*', (req, res, next: NextFunction) => {
  next(new AppError('Not found', 404));
});

// Error handling middleware should be the very last
app.use(errorHandlingMiddleware);

serverConfig(server).startServer();

export type RedisClient = typeof redisClient;