import { Router } from 'express';
import { renderMain, enterRoom, removeRoom, sendChat } from '../controller/chatController';
import passport from '../middleware/passport';

const requireAuth = passport.authenticate("jwt", { session: false });

export const chatRoutes: Router = Router();

chatRoutes.get('/', renderMain);

chatRoutes.get('/room/:id', enterRoom);

chatRoutes.delete('/room/:id', removeRoom);

chatRoutes.post('/room/:id/chat', requireAuth, sendChat);