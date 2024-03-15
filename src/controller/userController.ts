import { validationResult } from "express-validator";
import Logger from "../logger/logger"
import { NextFunction, Request, Response } from 'express';
import { smtpTransport } from "../config/email/email";
import config from "../config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateRandomNumber = (min: number, max: number) => {
    const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randNum;
}

//
export const pwfind = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        }

        const number = generateRandomNumber(111111, 999999);

        const email = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });

        if(email){
            const mailOptions = {
                from: config.naver.user,
                to: email,
                subject: " 인증 관련 메일 입니다. ",
                html: '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + number
            }

            smtpTransport.sendMail(mailOptions, (err, response) => {
                if (err) {
                    res.json({ ok: false, msg: ' 메일 전송에 실패하였습니다. ' })
                    smtpTransport.close()
                    return
                } else {
                    res.json({ ok: true, msg: ' 메일 전송에 성공하였습니다. ', authNum: number })
                    smtpTransport.close()
                    return
    
                }
            })
        }

    } catch (error) {
        Logger.error(error)
    }
}