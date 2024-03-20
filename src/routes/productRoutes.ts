import { Router } from 'express';
import passport from '../middleware/passport';
import { deletePrcdt, findPrdct, myPrdct, savePrdct, updatePrdct } from '../controller/productController';

const requireAuth = passport.authenticate("jwt", { session: false });

export const productRoutes: Router = Router();

productRoutes.post('/seller-product/:id', requireAuth, savePrdct);
productRoutes.get('/seller-product/:id/partial', findPrdct);
productRoutes.get('/seller-product/:id', requireAuth, myPrdct);
productRoutes.patch('/seller-product/:id', requireAuth, updatePrdct);
productRoutes.delete('/seller-product/:id', requireAuth, deletePrcdt);