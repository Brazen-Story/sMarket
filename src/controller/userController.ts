import Logger from "../logger/logger"
import { NextFunction, Request, Response } from 'express';
import config from "../config";
import { PrismaClient, User } from "@prisma/client";
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const userByEmail = async (email: string) => {
    await prisma.user.findUnique({
        where: {
            email,
        },
    });

    return email;
}

export const userByphoneNumber = async (phonedNumber: number) => {
    await prisma.user.findUnique({
        where: {
            phone_number: phonedNumber,
        },
    });

    return phonedNumber;
}

export const updatePw = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const oldPassword: string = req.body.password;
        const newPassword: string = req.body.newPassword;
        const accessToken: string = req.cookies.accessToken;

        const decoded = jwt.verify(accessToken, config.jwt.accessKey) as JwtPayload;

        const findPw = await prisma.user.findUnique({
            where: {
                email: decoded.sub
            },
            select: {
                password: true,
            }
        });

        if (!findPw) {
            res.json({ err: "인증 에러.." })
            return;
        }

        const compareResult = await bcrypt.compare(oldPassword, findPw.password);

        if (!compareResult) {
            res.json({ err: "비밀번호가 틀렸습니다.." })
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {
                email: decoded.sub
            },
            data: {
                password: hashedPassword,
            },
        })

        res.json({ status: 'success', message: '비밀번호가 업데이트되었습니다.' })

    } catch (error) {
        Logger.error(error);
    }
}
