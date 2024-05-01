import { Server as HttpServer } from 'http';
import { Application } from 'express';
import { Server as SocketIOServer, Socket } from 'socket.io';

export const WebSocket = (server: HttpServer, app: Application) => {
  const io = new SocketIOServer(server);

  app.set('io', io)

  const room = io.of('/room');
  const chat = io.of('/chat');

  room.on('connection', (socket: Socket) => {
    console.log('room 접속');

    socket.on('disconnect', () => {
      console.log('room 접속 해제');
    });
  });

  chat.on('connection', (socket: Socket) => {
    console.log('chat 접속');

    socket.on('disconnect', () => {
      console.log('chat 접속 해제');
    })
  })
}