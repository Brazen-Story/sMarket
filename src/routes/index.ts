import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";
import { productRoutes } from "./productRoutes";
import { categoryRoutes } from "./categoryRoutes";
import { revievwRoutes } from "./reviewRoutes";
import { chatRoutes } from "./chatRoutes";
import { Express } from "express";

export const setupRoutes = (app: Express) => {
  app.use('/auth', authRoutes);
  app.use('/user', userRoutes);
  app.use('/product', productRoutes);
  app.use('/categories', categoryRoutes);
  app.use('/product-review', revievwRoutes);
  app.use('/chat', chatRoutes);
};