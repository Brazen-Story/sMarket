import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { body } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { register, login } from '../../src/controller/authController';
import bcrypt from 'bcryptjs';
import { generateRandomNumber } from '../internal/generate-random-number';
import { User } from '../../src/intrefaces/user';
import { prismaMock } from '../singleton';
import { app } from '../../src';

describe('auth Entity', () => {
  let userNumberData: number;
  let userStringData: string;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    userNumberData = generateRandomNumber(1000, 9999, false) as number;
    userStringData = generateRandomNumber(1000, 9999, true) as string;

    const user: User = {
      user_id: userStringData,
      name: userStringData,
      phone_number: userNumberData,
      address: userStringData,
      email: userStringData,
      password: userStringData,
      biography: null,
      images: {
        profileImage: null,
        backgroundImage: null,
      },
    };

    req = {
      body: { user },
    } as unknown as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    next = jest.fn() as NextFunction;
  });

  it('register - 회원가입', async () => {
    const user = req.body.user as User;

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createUser: User = {
      ...user,
      password: hashedPassword,
    };

    prismaMock.user.create.mockResolvedValue(createUser);

    await register(req, res, next);

    // then
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        email: user.email,
        name: user.name,
        password: expect.any(String), // 해싱된 비밀번호를 expect.any(String)으로 처리
        phone_number: user.phone_number,
        address: user.address,
        images: {
          create: [{
            profile_image: null,
            background_image: null,
          }],
        },
        biography: null,
      },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ code: "success", message: "" });
  });

  it('login - 로그인', async () => {
    const user = {
      user_id: '1234',
      email: 'test@example.com',
      address: '123 Main St',
      name: 'John Doe',
      phone_number: 1234567890, // phone_number를 number로 설정
      password: await bcrypt.hash('password123', 10),
      biography: null, // 추가된 biography 속성
    };

    prismaMock.user.findUnique.mockResolvedValue(user);

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe('success');
    expect(response.body.userData).toHaveProperty('access_Token');
    expect(response.body.userData).toHaveProperty('refresh_Token');
  });

  it('login - 로그인 실패: 잘못된 자격 증명', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post('/login')
      .send({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
  });

  it('login - 로그인 실패: 이메일 또는 비밀번호 누락', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: '',
        password: '',
      });

    expect(response.status).toBe(400);
  });
});
