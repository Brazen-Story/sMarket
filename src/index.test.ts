import express, { Express } from 'express';
import request from 'supertest';
import { Server } from 'http';

// 이 부분은 당신의 Express 앱을 설정하는 곳입니다.
const app: Express = express();
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});

describe('Server Start Test', () => {
    let server: Server;

    // 테스트 실행 전 서버를 시작합니다.
    beforeAll((done: jest.DoneCallback) => {
        server = app.listen(3000, () => {
            console.log('Test server running on port 3000');
            done();  // 서버 시작이 완료되었음을 Jest에 알립니다.
        });
    });

    // 테스트가 끝난 후 서버를 종료합니다.
    afterAll((done: jest.DoneCallback) => {
        server.close(() => {
            console.log('Test server stopped');
            done();  // 서버 종료가 완료되었음을 Jest에 알립니다.
        });
    });

    // 실제 테스트: 서버가 포트 3000에서 리스닝 중인지 확인합니다.
    test('Server should be running on port 3000', async () => {
        const currentPort: number = server.address() ? (server.address() as any).port : 0;
        expect(currentPort).toEqual(3000);  // 기대하는 포트 번호와 비교합니다.
    });
});
