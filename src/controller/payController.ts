import { NextFunction, Request, Response } from 'express';
import Logger from '../logger/logger';
import { buyer } from '../intrefaces/pay';

import prisma from '../client';

//가격 변동(판매 중), pay로 별도 구분
export const priceRise =  async (req: Request, res: Response, next: NextFunction) => {
    try{
        const productId: string = req.params.id;
        const buyer: buyer = req.body;
    
        const product = await prisma.product.findUnique({
            where: {
                product_id: productId,
            }
        })
    
        if(product && new Date() > product.registration_date) {
            res.send({ message: "경매가 이미 종료되었습니다." });
        }
    
        if (product && (buyer.price < (product.start_price + (product.reserve_price || 0)))) {
            res.send({ message: "입찰 가격이 낮습니다." })
        }
    
        const bid = await prisma.bid.create({
            data: {
              user_id: buyer.userId,
              product_id: productId,
              bidPrice: buyer.price,
              bidTime: new Date(),
            },
          });
    
        await prisma.product.update({
            where: {
                product_id: productId
            },
            data: {
                reserve_price: buyer.price,
            }
        })
    
        res.json({ message: "성공적으로 입찰되었습니다." })
    }catch(error) {
        Logger.error(error);
    }
   
}


// 낙찰
//스케줄러 이용해서 디비 조회, 리스트 추출, 산사람 조회해서 연결.
export const bidSuccess = async (req: Request, res: Response, next: NextFunction) => {
    try{
        

    } catch(error){
        Logger.error(error);
    }
}