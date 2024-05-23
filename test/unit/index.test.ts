import express, { Express } from 'express';
import request from 'supertest';
import http from 'http';

const app: Express = express();

describe('Server Start Test', () => {
    let server: http.Server;

    beforeAll((done) => {
        server = app.listen(3000, () => {
            console.log('Test server running on port 3000');
            done();
        });
    });

    afterAll((done) => {
        server.close(() => {
            console.log('Test server stopped');
            done();
        });
    });

    test('Server should be running on port 3000', () => {
        const address = server.address();
        const port = typeof address === 'string' ? address : address?.port;
        expect(port).toBe(3000);
    });
});
