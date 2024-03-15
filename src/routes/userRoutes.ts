import { Router } from 'express';
import { body } from 'express-validator';
import { pwfind } from '../controller/userController';

//업데이트, 조회 
export const userRoutes: Router = Router();

userRoutes.post('/pwfind',
    [
        body('email').trim().notEmpty().isEmail().withMessage('이메일은 형식이 아닙니다.')
    ],
    pwfind);