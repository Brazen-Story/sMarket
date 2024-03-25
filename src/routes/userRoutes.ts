import { Router } from 'express';
import { body } from 'express-validator';
import passport from '../middleware/passport';
import { profile, updatePw, updateProfile, deleteUser, likeProduct } from '../controller/userController';

const requireAuth = passport.authenticate("jwt", { session: false });
 
export const userRoutes: Router = Router();

userRoutes.post('/update/:id', 
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
    requireAuth,
    updatePw);

userRoutes.get('/profile', requireAuth, profile);
userRoutes.patch('/profile/:id', requireAuth, updateProfile);
userRoutes.delete('/:id', requireAuth, deleteUser);
userRoutes.get('/like-product/:id', requireAuth, likeProduct);