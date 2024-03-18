import { Router } from 'express';
import { body } from 'express-validator';
import { updatePw } from '../controller/userController';
 
export const userRoutes: Router = Router();

userRoutes.post('/update', 
    [
        body("password").trim().notEmpty().withMessage('기존 비밀번호를 입력해주세요.'),
        body("newPassword").trim().notEmpty().isLength({ min: 6, max: 20}).withMessage('새 비밀번호를 입력해주세요.'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('비밀번호가 일치하지 않습니다.');
            }
            return true;
          }),
    ],
    updatePw);
