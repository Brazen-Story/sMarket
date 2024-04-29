import { Socket as BaseSocket } from 'socket.io';

export interface roomData {
    productId: string;
    sellerId: string;
}

export interface messageData {
    roomId: string;
    userId: string;
    content: string;
}