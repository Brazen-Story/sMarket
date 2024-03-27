import { Prisma, PrismaClient, Status } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import Logger from '../logger/logger';
import { PaginationResult, createProduct, pagination, updateProduct } from '../intrefaces/product';

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

async function isLeafCategory(categoryId: string) {
    const childrenCount = await prisma.category.count({
      where: {
        parent_id: categoryId,
      },
    });
    
    return childrenCount === 0;
  }

  
//상품 등록
export const savePrdct = async (req: Request, res: Response) => {
    try {
        const productData: createProduct = req.body;
        const userId: string = req.params.id;

        const isLeaf = await isLeafCategory(productData.categoryId);
        if (!isLeaf) {
            return res.status(400).json({ message: "선택한 카테고리는 최하위 카테고리가 아닙니다." });
        }
        
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
                category: {
                    connect: { category_id: productData.categoryId }
                },
                images: {
                    create: [{
                        image_1: productData.images.image_1,
                        image_2: productData.images.image_2 || null,
                        image_3: productData.images.image_3 || null,
                    }]
                }
            }
        });

        return res.status(200).json({ message: "등록 성공" })

    } catch (error) {
        Logger.error(error);
    }
}

//특정 상품 조회
export const findPrdct = async (req: Request, res: Response) => {
    try {
        const productId: string = req.params.id;

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
                },
            }
        });

        const likeCount = await prisma.product_liked.count({
            where: {
                product_id: productId,
            },
        });

        if (product) {        
            return res.status(200).json({
                ...product,
                likeCount,
            });
        }

    } catch (error) {
        Logger.error(error);
    }
}

//정렬처리
const getPaginationAndOrderOptions = (page: number, limit: number, sort: string, status?: string, userId?: string, searchName?: string) => {
    const startIndex = (page - 1) * limit;

    let orderBy: Prisma.ProductOrderByWithRelationInput;
    switch (sort) {
        case 'latest':
            orderBy = { registration_date: 'desc' };
            break;
        case 'lowPrice':
            orderBy = { start_price: 'asc' };
            break;
        case 'highPrice':
            orderBy = { start_price: 'desc' };
            break;
        default:
            orderBy = { registration_date: 'desc' };
    }

    let where: Prisma.ProductWhereInput = {};
    if (status && status !== 'all') {
        where.status = status as Status;
    }
    if (userId) {
        where.seller_id = userId;
    }
    if (searchName) {
        where.title = { contains: searchName };
    }

    return { take: limit, skip: startIndex, orderBy, where };
}

//상품 조회 및 페이징 정보 계산
const fetchProducts = async (page: number, limit: number, sort: string, status?: string, userId?: string, searchName?: string) => {
    const options = getPaginationAndOrderOptions(page, limit, sort, status, userId, searchName);

    const totalCount = await prisma.product.count({
        where: options.where,
    });
    const totalPage = Math.ceil(totalCount / limit);
    const products = await prisma.product.findMany({
        ...options,
        include: {
            images: {
                select: {
                    image_1: true,
                },
            },
            _count: {
                select: {
                    likes: true,
                },
            }
        },
    });

    return {
        totalPage,
        paginateData: products,
    };
}

//마이페이지
export const myPrdct = async (req: Request, res: Response) => {
    try {
        const myPrdct: pagination = {
            userId: req.params.id as string,
            page: parseInt(req.query.page as string, 10) || 1,
            limit: parseInt(req.query.limit as string, 10) || 15,
            status: req.query.status as string,
            sort: (req.query.sort as string) || 'latest',
        };

        const result = await fetchProducts(myPrdct.page, myPrdct.limit, myPrdct.sort, myPrdct.status, myPrdct.userId);

        return res.send({ data: result });
    } catch (error) {
        Logger.error(error);
    }
}

//메인페이지
export const mainPrdct = async (req: Request, res: Response) => {
    try {
        const queryParams: pagination = {
            page: parseInt(req.query.page as string, 10) || 1,
            limit: parseInt(req.query.limit as string, 10) || 15,
            status: req.query.status as string,
            sort: (req.query.sort as string) || 'latest',
            searchName: decodeURIComponent((req.query.searchName as string) || ''),
        };

        const result = await fetchProducts(queryParams.page, queryParams.limit, queryParams.sort, queryParams.status, undefined, queryParams.searchName);

        return res.send({ data: result });
    } catch (error) {
        Logger.error(error);
    }
}

//수정
export const updatePrdct = async (req: Request, res: Response) => {
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
export const deletePrcdt = async (req: Request, res: Response) => {
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

//좋아요
export const addLikeToProduct = async (req: Request, res: Response) => {
    try {
        const userId: string = req.params.id;
        const productId: string = req.body.id;

        await prisma.product_liked.create({
            data:{
                user_id: userId,
                product_id: productId,
            },
        });

        res.json({ message: "성공" })
    } catch (error) {
        Logger.error(error);
    }
};

//좋아요 취소
export const removeLikeFromProduct = async (req: Request, res: Response) => {
    try {
        const likeId: string = req.params.id;

        await prisma.product_liked.delete({
            where: {
                id: likeId,
            },
        });

        res.json({ message: "성공" })
    } catch (error) {
        Logger.error(error);
    }
};
