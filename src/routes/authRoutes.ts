import { Router } from 'express';
import { login, logout, register, auth, renew } from '../controller/authController';
import { body, validationResult } from 'express-validator';
import passport from '../middleware/passport';
import { NextFunction, Request, Response } from 'express';

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignIn = passport.authenticate("local", { session: false });

export const authRoutes: Router = Router();

authRoutes.post('/register',
  [
    body("user.name").trim().notEmpty().withMessage('사용자 이름은 비워둘 수 없습니다.'),
    body("user.phoneNumber").notEmpty().isInt().withMessage('전화번호는 비워둘 수 없습니다.'),
    body("user.address").trim().notEmpty().withMessage('주소는 비워둘 수 없습니다.'),
    body("user.email").trim().notEmpty().isEmail().withMessage('이메일은 형식이 아닙니다.'),
    body("user.password").trim().notEmpty().isLength({ min: 6, max: 20 }).withMessage('최소 6자 최대 20자를 지켜주세요'),
    body('user.confirmPassword').custom((value, { req }) => {
      if (value !== req.body.user.password) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
      return true;
    }),
  ],
  register);

  authRoutes.post('/login',
  [
    body("email").trim().notEmpty().isEmail().withMessage('이메일은 형식이 아닙니다.'),
    body("password").trim().notEmpty().withMessage('비밀번호는 비워둘 수 없습니다.'),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  requireSignIn,
  login
);

authRoutes.post('/renew', renew);
authRoutes.post('/logout', requireAuth, logout);

authRoutes.post('/test', requireAuth, auth);