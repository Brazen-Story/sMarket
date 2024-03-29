import { PrismaClient } from "@prisma/client";
import Logger from "../logger/logger";
import { Request, Response } from 'express';
import { Category } from "../intrefaces/category";

const prisma = new PrismaClient();

export const findCategory = async (req: Request, res: Response) => {
    try {
        const depth: number = parseInt(req.params.id, 10);

        if (depth) {
            const data: Category[] = await prisma.category.findMany({
                where: {
                    depth: depth,
                },
                select: {
                    category_id: true,
                    name: true,
                    depth: true,
                }
            });


            res.send({
                code: "success",
                message: "",
                data
            });
        }

    } catch (error) {
        Logger.error(error);
    }
}

export const allCategory = async (req: Request, res: Response) => {
    try{
        const data: Category[] = await prisma.category.findMany({
            where: {
                parent_id: null,
            },
            select: {
                category_id: true,
                name: true,
                depth: true,
                children: {
                    select: {
                        category_id: true,
                        name: true,
                        depth: true,
                        children: {
                            select: {
                                category_id: true,
                                name: true,
                                depth: true,
                            }
                        }
                    }
                }
            }
        });

        res.send({
            code: "success",
            message: "",
            data
        });

    }catch (error) {
        Logger.error(error);
    }
}
