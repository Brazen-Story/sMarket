import { Server as HttpServer } from 'http';
import { Application } from 'express';
import { Server as SocketIOServer, Socket } from 'socket.io';
// //2명의 접속자
// //채팅방을 2명 중 1명이 "나가기"를 누르면 없어짐.(기록삭제)
// //뒤로가기는 괜찮음
// //로그로 누가 보낸건지 저장할껀지 고민
// //소켓을 사용ㅇ시에는 쿠키가 필요없다, 음...처음에 입찰 그리고 상품등록부터 쿠키로 계속해서 인증을 해왔기때문이다.

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

    socket.on('join', (data: string) => {
      socket.join(data);
    });

    socket.on('disconnect', () => {
      console.log('chat 접속 해제');
    })
  })
}