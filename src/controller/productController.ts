import { Prisma, PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import Logger from '../logger/logger';
import { PaginationResult, createProduct, queryProduct, updateProduct } from '../intrefaces/product';

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
export const savePrdct = async (req: Request, res: Response, next: NextFunction) => {
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

        return res.send({ message: "등록 성공" })

    } catch (error) {
        Logger.error(error);
    }
}

//특정 상품 조회
export const findPrdct = async (req: Request, res: Response, next: NextFunction) => {
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

//페이징처리
//유저 상품 모두 조회
export const myPrdct = async (req: Request, res: Response, next: NextFunction) => {
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

        return res.json({ message: "success", myProduct });

    } catch (error) {
        Logger.error(error)
    }
}

//페이징 매김 
export const pagination = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryParams: queryProduct = {
            page: parseInt(req.query.page as string, 10) || 1,
            limit: parseInt(req.query.limit as string, 10) || 15,
            status: (req.query.status as string) || 'active',
            sort: (req.query.sort as string) || 'latest',
            searchName: decodeURIComponent((req.query.searchName as string) || ''),
        };

        const startIndex = (queryParams.page - 1) * queryParams.limit;
        const totalCount = await prisma.product.count();
        const totalPage = Math.ceil(totalCount / queryParams.limit);
        const result = {} as PaginationResult;

        let orderBy: Prisma.ProductOrderByWithRelationInput;
        switch (queryParams.sort) {
            case 'latest':
                orderBy = {
                    registration_date: 'desc',
                };
                break;
            case 'lowPrice':
                orderBy = {
                    start_price: 'asc',
                };
                break;
            case 'highPrice':
                orderBy = {
                    start_price: 'desc',
                };
                break;
            default:
                orderBy = {
                    registration_date: 'desc',
                };
        }

        if (queryParams.page < 0) {
            return res.send({ message: "page는 1 이상이어야합니다." })
        } else{
            result.totalPage = totalPage;
            result.paginateData = await prisma.product.findMany({
                take: queryParams.limit,
                skip: startIndex,
                where: {
                    title: {
                        contains: queryParams.searchName,
                    },
                    status: queryParams.status,
                },
                orderBy: orderBy,
                include: {
                    images: {
                        select: {
                            image_1: true,
                        }
                    }
                }
            });
        }
        return res.send({ data: result });
    } catch (error) {
        Logger.error(error);
    }
}

//수정
export const updatePrdct = async (req: Request, res: Response, next: NextFunction) => {
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

        if (image) {
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

        return res.json({ message: "success" })

    } catch (error) {
        Logger.error(error)
    }
}

//상품 삭제
export const deletePrcdt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId: string = req.params.id;

        await prisma.product.deleteMany({
            where: {
                product_id: productId,
            },
        });

        res.json({ message: "success " });

    } catch (error) {
        Logger.error(error)
    }
}
