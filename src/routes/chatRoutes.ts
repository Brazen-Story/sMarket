import { Router } from 'express';
import { renderMain, enterRoom, removeRoom, sendChat } from '../controller/chatController';
import passport from '../middleware/passport';
import { validatorErrorChecker } from '../middleware/validator';
import { body } from 'express-validator';

const requireAuth = passport.authenticate("jwt", { session: false });

export const chatRoutes: Router = Router();

chatRoutes.get('/', requireAuth, renderMain);
chatRoutes.get('/room/:id', requireAuth, enterRoom);

chatRoutes.post('/room/:id/chat',
    [
        body('message').notEmpty().withMessage('메시지를 입력하세요.'),
        validatorErrorChecker
    ],
    requireAuth,
    sendChat
);

chatRoutes.delete('/room/:id', requireAuth, removeRoom);
