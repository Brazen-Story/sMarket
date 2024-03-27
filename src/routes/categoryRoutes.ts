import { Router } from 'express';
import { allCategory, findCategory } from '../controller/categoryController';

export const categoryRoutes: Router = Router();

categoryRoutes.get('/', allCategory);
categoryRoutes.get('/:id', findCategory);
