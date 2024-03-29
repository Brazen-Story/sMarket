import { Router } from 'express';
import passport from '../middleware/passport';
import { deletePrcdt, findPrdct, myPrdct, savePrdct, mainPrdct, updatePrdct, addLikeToProduct, removeLikeFromProduct } from '../controller/productController';
import { body } from 'express-validator';
import { validatorErrorChecker } from '../middleware/validator';

const requireAuth = passport.authenticate("jwt", { session: false });

export const productRoutes: Router = Router();

productRoutes.post('/seller-product/',
    [
        body('title').notEmpty().withMessage('제목을 입력해주세요.'),
        body('description').notEmpty().withMessage('설명을 입력해주세요.'),
        body('endDate').notEmpty().withMessage('마감시간을 정해주세요.'),
        body('startPrice').notEmpty().withMessage('시작가격을 입력해주세요.'),
        body('categoryId').notEmpty().withMessage('카테고리를 정해주세요.'),
        body('images.image_1').notEmpty().withMessage('대표 이미지 하나는 필수 입니다.'),
        validatorErrorChecker
    ],
    requireAuth,
    savePrdct
);

productRoutes.get('/seller-product/:id/partial', findPrdct);
productRoutes.get('/seller-product/:id', requireAuth, myPrdct);
productRoutes.get('/seller-product', mainPrdct);

productRoutes.patch('/seller-product/:id',
    [
        body('title').notEmpty().withMessage('제목을 입력해주세요.'),
        body('description').notEmpty().withMessage('설명을 입력해주세요.'),
        body('endDate').notEmpty().withMessage('마감시간을 정해주세요.'),
        body('startPrice').notEmpty().withMessage('시작가격을 입력해주세요.'),
        body('categoryId').notEmpty().withMessage('카테고리를 정해주세요.'),
        body('images.image_1').notEmpty().withMessage('대표 이미지 하나는 필수 입니다.'),
        validatorErrorChecker
    ],
    requireAuth,
    updatePrdct
);

productRoutes.delete('/seller-product/:id', requireAuth, deletePrcdt);
productRoutes.post('/liked-product/:id', requireAuth, addLikeToProduct);
productRoutes.delete('/liked-product/:id', requireAuth, removeLikeFromProduct);