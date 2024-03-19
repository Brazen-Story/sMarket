import { PrismaClient, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import HttpException from '../models/http-exception.model';
import { JwtPayload, JwtUserInfo, Login, Register } from '../intrefaces/user';
import brcypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import config from '../config';
import { redisCli } from '../config/redis/redis';
import Logger from '../logger/logger';
import { userByEmail, userByphoneNumber } from './userController';

const prisma = new PrismaClient();

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

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        }

        const Register: Register = req.body.user;

        await checkUserUniqueness(Register.email, Register.phoneNumber);

        const hashedPassword = await brcypt.hash(Register.password, 10);

        await prisma.user.create({
            data: {
                email: Register.email,
                name: Register.name,
                password: hashedPassword,
                phone_number: Register.phoneNumber,
                address: Register.address,
            }
        });

        res.json({ status: 'success', message: '사용자 등록이 완료되었습니다.' })

    } catch (error) {
        Logger.error(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userInfo = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
            select: {
                user_id: true,
                email: true,
            }
        })

        if(userInfo){
            res.send({
                access_Token: IssuanceAccessToken(userInfo),
                refresh_Token: IssuanceRefreshToken(userInfo),
                userInfo,
            });
        }

    } catch (error) {
        Logger.error(error);
    }
}

export const renew = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const data = jwt.verify(refreshToken, config.jwt.refreshKey) as User;

        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            },
        });

        const valuser_idity = redisCli.get(refreshToken);

        if (user && !valuser_idity) {
            res.send({
                access_Token: IssuanceAccessToken(user),
                status: 'success'
            })
        }

    } catch (error) {
        console.log(error)
    }
}


export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken: string = req.cookies.refreshToken;
        const data = jwt.verify(refreshToken, config.jwt.refreshKey) as JwtPayload;

        if (data) {
            const expTime = data.exp - Math.floor(Date.now() / 1000); // 만료 시간 계산
            await redisCli.setEx(refreshToken, expTime, 'blacklisted'); // Redis에 토큰 저장
            console.log('리프레시 토큰이 블랙리스트에 추가됨');
        }

        res.clearCookie('refreshToken').send('로그아웃 완료');

    } catch (error) {
        console.error(error);
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.json({ result: true });
    } catch (error) {
        console.error(error);
        next(error);
    }
}