import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import Logger from '../logger/logger';
import { createProduct, updateProduct } from '../intrefaces/product';
import { buyer } from '../intrefaces/pay';

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
export const savePrdct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productData: createProduct = req.body;
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
export const findPrdct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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

        res.json({ message: "success", product })

    } catch (error) {
        Logger.error(error);
    }
}

//내 상품 모두 조회
export const myPrdct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId: string = req.params.id;

        const myProduct = await prisma.user.findUnique({
            where: {
                user_id: userId
            },
            select: {
                products: {
                    select: {
                        title: true,
                        description: true,
                        registration_date: true,
                        end_date: true,
                        start_price: true,
                        reserve_price: true,
                        hammer_price: true,
                        status: true,
                        images: {
                            select: {
                                image_1: true,
                            }
                        }
                    }
                }
            }
        })

        res.json({ message: "success", myProduct });

    } catch (error) {
        Logger.error(error)
    }
}

//수정
export const updatePrdct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productId: string = req.params.id;
        const productData: updateProduct = req.body;

        if (productData.startPrice < productData.reservePrice) {
            res.send({ message: "시작가가 경매가 보다 낮으면 안됩니다." });
            return;
        }

        const image = await prisma.product_image.findFirst({
            where: {
                product_id: productId,
            },
            select: {
                image_id: true,
            }
        });

        if(image) {
            await prisma.product.update({
                where: {
                    product_id: productId,
                },
                data: {
                    title: productData.title,
                    description: productData.description,
                    end_date: productData.endDate,
                    start_price: productData.startPrice,
                    status: productData.status,
                    images: {
                        update: {
                            where: {
                                image_id: image.image_id,
                            },
                            data: {
                                image_1: productData.images.image_1,
                                image_2: productData.images.image_2 || null,
                                image_3: productData.images.image_3 || null,
                            }
                        }
                    }
                },
            })
        }

        res.json({ message: "success" })

    } catch (error) {
        Logger.error(error)
    }
}

//상품 삭제
export const deletePrcdt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const productId: string = req.params.id;

        await prisma.product.deleteMany({
            where: {
                product_id: productId, 
            },
        });

        res.json({ message: "success "});

    }catch(error){
        Logger.error(error)
    }
}

//가격 변동(판매 중), pay로 별도 구분
export const priceRise =  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
}


// 낙찰, 구매자와 판매자 연결