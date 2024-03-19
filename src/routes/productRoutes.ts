import { Router } from 'express';
import { findProduct, saveProduct } from '../controller/productController';
import passport from '../middleware/passport';

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignIn = passport.authenticate("local", { session: false });

export const productRoutes: Router = Router();

productRoutes.post('/seller-product/:id', requireAuth, saveProduct);
productRoutes.get('/seller-product/:id', findProduct);
