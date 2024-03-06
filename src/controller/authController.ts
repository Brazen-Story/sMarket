import { PrismaClient, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import HttpException from '../models/http-exception.model';
import { Login, Register } from '../intrefaces/user';
import brcypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import config from '../config';

const prisma = new PrismaClient();

const checkUserUniqueness = async (email: string, phoneNumber: number) => {
    const existingUserByEmail = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    const existingUserByPhoneNumber = await prisma.user.findUnique({
        where: {
            phoneNumber,
        },
    });

    if (existingUserByEmail || existingUserByPhoneNumber) {
        throw new HttpException(422, {
            errors: {
                ...(existingUserByEmail ? { email: ['이미 사용 중 입니다.'] } : {}),
                ...(existingUserByPhoneNumber ? { phoneNumber: ['이미 사용 중 입니다.'] } : {}),
            },
        });
    }
};

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
                username: Register.username,
                password: hashedPassword,
                phoneNumber: Register.phoneNumber,
                address: Register.address,
            }
        });

        res.json({ status: 'success', message: '사용자 등록이 완료되었습니다.' })

    } catch (error) {
        next(error)
    }
}

function IssuanceAccessToken(user: Login) {
    const timestamp = new Date().getTime();
    return jwt.sign({
        sub: user.email,
        iat: timestamp
    }, config.accessKey, {
        expiresIn: '60m',
    });
}

function IssuanceRefreshToken(user: Login) {
    const timestamp = new Date().getTime();
    return jwt.sign({
        sub: user.email,
        iat: timestamp
    }, config.refreshKey, {
        expiresIn: '24h',
    });
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try{
        const userInfo = await prisma.user.findUnique({
        where: {
            email: req.body.email,
        },
        select: {
            id: true,
            username: true,
            phoneNumber: true,
            address: true,
        }
    })
    res.send({
         access_Token: IssuanceAccessToken(req.body),
         refresh_Token: IssuanceRefreshToken(req.body),
         userInfo,
     });
    } catch(error) {
        console.log(error)
    }
}

export const renew = async (req: Request, res: Response): Promise<void> => {
    try{
        const token = req.cookies.refresh_Token;
        const data = jwt.verify(token, config.refreshKey) as User;

        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            },
        });

        if(user) {
            res.send({
                access_Token: IssuanceAccessToken(user),
                status: 'success'
            })
        }

    } catch(error) {
        console.log(error)
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

//참고사항 : https://stackoverflow.com/questions/21978658/invalidating-json-web-tokens
export const logout = async (req: Request, res: Response): Promise<void> => {
    
}

