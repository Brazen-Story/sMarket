import { NextFunction, Request, Response } from 'express';
import Logger from '../logger/logger';

import prisma from '../client';
import { User } from '@prisma/client';

export const priceRise =  async (req: Request, res: Response, next: NextFunction) => {
    try{
        const productId: string = req.params.id;
        const userId: string = (req.user as User).user_id;
        const price: number = req.body.price;

        const product = await prisma.product.findUnique({
            where: {
                product_id: productId,
            }
        })
    
        if(product && new Date() > product.registration_date) { //end date?
            res.send({ message: "경매가 이미 종료되었습니다." });
        }
    
        if (product && (price < (product.start_price + (product.reserve_price || 0)))) {
            res.send({ message: "입찰 가격이 낮습니다." })
        }
    
        const bid = await prisma.bid.create({
            data: {
              user_id: userId,
              product_id: productId,
              bidPrice: price,
              bidTime: new Date(),
            },
          });
    
        await prisma.product.update({
            where: {
                product_id: productId
            },
            data: {
                reserve_price: price,
            }
        })
    
        res.json({ message: "성공적으로 입찰되었습니다." })
    }catch(error) {
        Logger.error(error);
    }
   
}