import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import HttpException from '../models/http-exception.model';
import { JwtPayload, JwtUserInfo, Login, Register } from '../intrefaces/user';
import brcypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import { redisCli } from '../config/redis/redis';
import Logger from '../logger/logger';
import { userByEmail, userByphoneNumber } from './userController';

import prisma from '../client';

const checkUserUniqueness = async (email: string, phonedNumber: number) => {
    const existingUserByEmail = await userByEmail(email);
    const existingUserByphone_number = await userByphoneNumber(phonedNumber);

    if (!existingUserByEmail || !existingUserByphone_number) {
        throw new HttpException(422, {
            errors: {
                ...(existingUserByEmail ? { email: ['이미 사용 중 입니다.'] } : {}),
                ...(existingUserByphone_number ? { phone_number: ['이미 사용 중 입니다.'] } : {}),
            },
        });
    }
};

const IssuanceAccessToken = (user: JwtUserInfo) => {
    const timestamp = new Date().getTime();
    return jwt.sign({
        iss: user.user_id,
        sub: user.email,
        iat: timestamp
    }, config.jwt.accessKey, {
        expiresIn: '60m',
    });
}

const IssuanceRefreshToken = (user: JwtUserInfo) => {
    const timestamp = new Date().getTime();
    return jwt.sign({
        iss: user.user_id,
        sub: user.email,
        iat: timestamp
    }, config.jwt.refreshKey, {
        expiresIn: '24h',
    });
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Register: Register = req.body.user;

        await checkUserUniqueness(Register.email, Register.phone_number);

        const hashedPassword = await brcypt.hash(Register.password, 10);

        await prisma.user.create({
            data: {
                email: Register.email,
                name: Register.name,
                password: hashedPassword,
                phone_number: Register.phone_number,
                address: Register.address,
                biography: null,
                images: {
                    create: [{
                        profile_image: null,
                        background_image: null,
                    }],
                }
            }
        });

        res.status(200).json({ code: "success", message: "" });

    } catch (error) {
        Logger.error(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
            select: {
                user_id: true,
                email: true,
                address: true,
                name: true,
                phone_number: true,
            }
        })

        if (user) {
            const { email, ...userData } = user;
            const { address, name, phone_number, ...userInfo } = user;
        
            const access_Token = IssuanceAccessToken(userInfo);
            const refresh_Token = IssuanceRefreshToken(userInfo);
        
            const responseData = {
                ...userData,
                access_Token,
                refresh_Token,
            };
        
            res.status(200).json({
                code: "success",
                message: "",
                userData: responseData,
            });
        }
        

    } catch (error) {
        Logger.error(error);
        next(error); // 다음 미들웨어에 오류 전달

    }
}

export const renew = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const userId: string = (req.user as User).user_id;

        const user = await prisma.user.findUnique({
            where: {
                user_id: userId,
            },
        });

        const valuser_idity = await redisCli.get(refreshToken);

        if (user && valuser_idity === null) {
            const { address, name, phone_number, ...userInfo } = user;
            const userData = IssuanceAccessToken(userInfo);

            res.status(200).json({
                code: 'success',
                message: "",
                userData
            })
        }

    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken: string = req.cookies.refreshToken;
        const data = jwt.verify(refreshToken, config.jwt.refreshKey) as JwtPayload;

        if (data) {
            const expTime = data.exp - Math.floor(Date.now() / 1000); // 만료 시간 계산
            await redisCli.setEx(refreshToken, expTime, 'blacklisted'); // Redis에 토큰 저장
        }

        res.clearCookie('refreshToken')
            .clearCookie('accessToken')
            .json({
                code: 'success',
                message: ""
            });

    } catch (error) {
        console.error(error);
    }
}