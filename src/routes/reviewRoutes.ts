import { Router } from 'express';
import passport from '../middleware/passport';
import { deleteReview, findReview, patchReview, saveReview } from '../controller/reviewController';
import { body } from 'express-validator';
import { validatorErrorChecker } from '../middleware/validator';

const requireAuth = passport.authenticate("jwt", { session: false });

export const revievwRoutes: Router = Router();

revievwRoutes.post('/:id',
    [
        body('coment').notEmpty().withMessage('리뷰를 남겨주세요.'),
        validatorErrorChecker
    ],
    requireAuth,
    saveReview
);

revievwRoutes.get('/:id', findReview);
revievwRoutes.delete('/:id', requireAuth, deleteReview);
revievwRoutes.patch('/:id',
    [
        body('coment').notEmpty().withMessage('리뷰를 남겨주세요.'),
        validatorErrorChecker
    ],
    requireAuth,
    patchReview
);