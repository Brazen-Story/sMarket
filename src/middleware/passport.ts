import { PrismaClient } from '@prisma/client';
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import * as bcrypt from 'bcrypt';
import config from '../config';
import { JwtPayload } from '../intrefaces/user';

const prisma = new PrismaClient();

const localOptions = { usernameField: 'email', passwordField: 'password' };
const passportVerify = new LocalStrategy(
    localOptions,
    async (email: string, password: string, done: any) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (!user) {
                done(null, false, { reason: '존재하지 않는 사용자 입니다.' });
                return;
            }

            const compareResult = await bcrypt.compare(password, user.password);

            if (!compareResult) {
                done(null, false, { reason: '올바르지 않은 비밀번호 입니다.' });
            }

            done(null, user);
            return;

        } catch (error) {
            console.error(error);
            done(error);
        }
    }
)

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: config.jwt.accessKey,
};

const JWTVerify = new JWTStrategy(jwtOptions, async (jwtPayload: JwtPayload, done: any) => {
    
    try {
        const user = await prisma.user.findUnique({ where: { email: jwtPayload.sub }, });
        if (!user) {
            done(null, false, { reason: 'ACCESS_TOKEN이 만료되었습니다.' });
        }

        done(null, user);
        return;
        
    } catch (error) {
        console.error(error);
        done(error);
    }
});

passport.use(passportVerify);
passport.use(JWTVerify);

export default passport;
