import { Router } from 'express';
import passport from '../middleware/passport';

const requireAuth = passport.authenticate("jwt", { session: false });

export const revievwRoutes: Router = Router();

