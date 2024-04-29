import { Server as HttpServer } from 'http';
import { Application } from 'express';
import { Server as SocketIOServer, Socket } from 'socket.io';

// 소켓 ID와 사용자 데이터를 연결하기 위한 Map
// const socketData = new Map<string, { productId: string; userId: string; sellerId: string; bidPrice: number; }>();

// export const chatConnect = (socket: Socket) => {
//     socket.on('connectsocketn', (socket: any) => {
//         console.log('A user connected');
      
//         // 채팅방에 참여
//         socket.on('joinRoom', ({ productId, userId, sellerId, bidPrice }) => {
//           const roomId = `product_${productId}`;
//           socket.join(roomId);
      
//           // 첫 메시지 전송 (채팅방 생성 시)
//           socket.to(roomId).emit('message', {
//             userId,
//             text: `채팅방이 생성되었습니다. 상품 ID: ${productId}, 입찰가: ${bidPrice}`,
//           });
      
//           console.log(`User ${userId} joined room ${roomId}`);
//         });
      
//         // 메시지 전송 로직
//         socket.on('sendMessage', ({ roomId, userId, message }) => {
//           socket.to(roomId).emit('message', { userId, text: message });
//         });
      
//         socket.on('disconnect', () => {
//           console.log('A user disconnected');
//         });
//       });
      
// };

// //2명의 접속자
// //채팅방을 2명 중 1명이 "나가기"를 누르면 없어짐.(기록삭제)
// //뒤로가기는 괜찮음
// //로그로 누가 보낸건지 저장할껀지 고민
// //소켓을 사용ㅇ시에는 쿠키가 필요없다, 음...처음에 입찰 그리고 상품등록부터 쿠키로 계속해서 인증을 해왔기때문이다.

export const WebSocket = (server: HttpServer, app: Application) => {
  const io = new SocketIOServer(server, { path: '/socket.io' });

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