import { Router } from 'express';
import passport from '../middleware/passport';
import { priceRise } from '../controller/payController';

const requireAuth = passport.authenticate("jwt", { session: false });

export const payRoutes: Router = Router();

payRoutes.post('/:id', requireAuth, priceRise);