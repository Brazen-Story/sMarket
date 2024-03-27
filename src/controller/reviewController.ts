import { Request, Response } from "express";
import Logger from "../logger/logger";
import { createReview } from "../intrefaces/review";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//id로 리뷰조회
//리뷰 등록
//리뷰 삭제

//등록
export const saveReview = async (req: Request, res: Response) => {
    try {
        const reviewData: createReview = req.body;

        await prisma.review.create({
            data: {
                coment: reviewData.coment,
                sellerId: reviewData.seller,
                buyerId: reviewData.buyer,
            }
        });
        return res.status(200).json({ message: "등록 성공" })

    } catch (error) {
        Logger.error(error);
    }
}

//조회
export const findReview = async (req: Request, res: Response) => {
    try {
        const sellerId: string = req.params.id;

        const data = await prisma.review.findMany({
            where: {
                sellerId: sellerId,
            },
            orderBy: {
                reviewTime: 'asc',
            }
        })

        res.status(200).json({ data });
    } catch (error) {
        Logger.error(error);
    }
}

//삭제
export const deleteReview = async (req: Request, res: Response) => {
    try {
        const reviewId: string = req.body.reviewId;
        const buyerId: string = req.body.buyerId;

        await prisma.review.delete({
            where:{
                review_id: reviewId,
                buyerId: buyerId,
            }
        })

        return res.status(200).json({ message: "삭제 성공" })

    } catch (error) {
        Logger.error(error);
    }
}