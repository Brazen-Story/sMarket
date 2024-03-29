import { Request, Response } from "express";
import Logger from "../logger/logger";
import { createReview } from "../intrefaces/review";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

//등록
export const saveReview = async (req: Request, res: Response) => {
    try {
        const sellerId: string = req.params.id;
        const coment: string = req.body.conment
        const buyer: string = (req.user as User).user_id;

        await prisma.review.create({
            data: {
                coment: coment,
                sellerId: sellerId,
                buyerId: buyer,
            }
        });
        return res.status(200).json({ code: "success", message: "" })

    } catch (error) {
        Logger.error(error);
    }
}

//조회(상품리뷰가 아닌 유저에 대한 리뷰다.)
export const findReview = async (req: Request, res: Response) => {
    try {
        const sellerId: string = req.params.id;

        const data = await prisma.review.findMany({
            where: {
                sellerId: sellerId,
            },
            orderBy: {
                reviewTime: 'asc',
            },
            select: {
                buyer: {
                    select: {
                        name: true,
                    }
                },
                review_id: true,
                coment: true,
                reviewTime: true,
            }
        })

        return res.status(200).json({ code: "success", message: "", data })
    } catch (error) {
        Logger.error(error);
    }
}

//삭제
export const deleteReview = async (req: Request, res: Response) => {
    try {
        const reviewId: string = req.params.reviewId;
        const userId: string = (req.user as User).user_id;

        await prisma.review.delete({
            where:{
                review_id: reviewId,
                buyerId: userId,
            }
        })

        return res.status(200).json({ code: "success", message: "" })

    } catch (error) {
        Logger.error(error);
    }
}

//리뷰수정
