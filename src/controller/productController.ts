import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import Logger from '../logger/logger';
import { ProductRequest } from '../intrefaces/product';

const prisma = new PrismaClient();

const parseDate = (dateStr: string) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    const second = dateStr.substring(12, 14);

    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
}

//상품 등록
// param으로 id
// {
//     "title": "장갑",w    q
//     "description": "싸게 놓아요",
//     "endDate": "20240319213000",
//     "startPrice": 3000,
//     "status": "판매 중",
//     "images": {
//         "image_1":"asdfsdfs",
//         "image_2":"gasdgs"
//     }
// }
export const saveProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productData: ProductRequest = req.body;
        const userId: string = req.params.id;

        await prisma.product.create({
            data: {
                seller: {
                    connect: { user_id: userId }
                },
                title: productData.title,
                description: productData.description,
                end_date: parseDate(productData.endDate),
                start_price: productData.startPrice,
                status: productData.status,
                images: {
                    create: [{
                        image_1: productData.images.image_1,
                        image_2: productData.images.image_2 || null,
                        image_3: productData.images.image_3 || null,
                    }]
                }
            }
        });

        res.send({ message: "등록 성공" })

    } catch (error) {
        Logger.error(error);
    }
}

//특정 상품 조회
export const findProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const productId: string = req.params.id

        const product = await prisma.product.findUnique({
            where: {
                product_id: productId,
            },
            select: {
                title: true,
                description: true,
                registration_date: true,
                end_date: true,
                start_price: true,
                reserve_price: true,
                hammer_price: true,
                status: true,
                images: true,
                seller: {
                    select: {
                        name: true,
                    }
                }
            }
        });
        
        res.json({message: "success", product})
        
    }catch (error) {
        Logger.error(error);
    }
}


//상품 수정

//상품 삭제
//가격 변동(판매 중)
// 낙찰, 구매자와 판매자 연결
