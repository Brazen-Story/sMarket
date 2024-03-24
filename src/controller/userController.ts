import Logger from "../logger/logger"
import { Request, Response } from 'express';
import config from "../config";
import { PrismaClient, User } from "@prisma/client";
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UserUpdate } from "../intrefaces/user";

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

export const updatePw = async (req: Request, res: Response) => {

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

export const profile = async (req: Request, res: Response) => {
    try {
        const userId: string = req.params.id;

        const profileData = await prisma.user.findUnique({
            where: {
                user_id: userId,
            },
            select: {
                name: true,
                biography: true,
                address: true,
                images: {
                    select: {
                        profile_image: true,
                        background_image: true,
                    }
                }
            }
        });

        res.json({ status: 'success', profileData });

    } catch (error) {
        Logger.error(error);
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId: string = req.params.id;
        const updateData: UserUpdate = req.body;

        const image = await prisma.user_image.findFirst({
            where: {
                user_id: userId,
            },
            select: {
                image_id: true,
            }
        });

        if (image) {
            await prisma.user.update({
                where: {
                    user_id: userId,
                },
                data: {
                    name: updateData.name,
                    address: updateData.address,
                    biography: updateData.biography,
                    images: {
                        update: {
                            where: {
                                image_id: image.image_id
                            },
                            data: {
                                profile_image: updateData.images.profileImage || null,
                                background_image: updateData.images.backgroundImage || null,
                            }
                        }
                    }
                }
            })
        }

        return res.json({ message: "success" })

    } catch (error) {
        Logger.error(error);
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId: string = req.params.id;
        
        await prisma.user.deleteMany({
            where: {
                user_id: userId,
            },
        });

        res.json({ message: "success " });

    } catch (error) {
        Logger.error(error);
    }
}