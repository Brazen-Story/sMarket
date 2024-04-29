import { Router } from 'express';
import { renderMain, renderRoom, createRoom, enterRoom, removeRoom, sendChat } from '../controller/chatController';

export const chatRoutes: Router = Router();

chatRoutes.get('/', renderMain);

chatRoutes.get('/room', renderRoom);

chatRoutes.post('/room', createRoom);

chatRoutes.get('/room/:id', enterRoom);

chatRoutes.delete('/room/:id', removeRoom);

chatRoutes.post('/room/:id/chat', sendChat);