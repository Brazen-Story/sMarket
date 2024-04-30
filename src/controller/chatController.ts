import { User } from '@prisma/client';
import prisma from '../client';
import Logger from "../logger/logger"
import { Request, Response } from 'express';
import { messageData, roomData } from '../intrefaces/socket';

export const renderMain = async (req: Request, res: Response) => {

    const userId: string = (req.user as User).user_id;

    try {
        const data = await prisma.chat_room.findMany({
            where: {
                OR: [
                    { buyer_id: userId },
                    { seller_id: userId }
                ]
            },
            select: {
                chat_id: true,
                chatTime: true,
                product: {
                    select: {
                        title: true,
                        images: {
                            select: {
                                image_1: true
                            }
                        }
                    }
                },
                seller: {
                    select: {
                        name: true,
                        images: {
                            select: {
                                profile_image: true
                            }
                        }
                    }
                },
                buyer: {
                    select: {
                        name: true,
                        images: {
                            select: {
                                profile_image: true
                            }
                        }
                    }
                }
            }
        });

        res.status(200).json({ code: 'success', message: " ", data });

    } catch (error) {
        Logger.error(error);
    }
}

export const enterRoom = async (req: Request, res: Response) => {
    const chatId: string = req.params.id;

    try {
        const data = await prisma.chat_room.findUnique({
            where: {
                chat_id: chatId
            },
            select: {
                product: {
                    select: {
                        title: true,
                        images: {
                            select: {
                                image_1: true
                            }
                        }
                    }
                },
                seller: {
                    select: {
                        name: true,
                        images: {
                            select: {
                                profile_image: true
                            }
                        }
                    }
                },
                buyer: {
                    select: {
                        name: true,
                        images: {
                            select: {
                                profile_image: true
                            }
                        }
                    }
                },
                chatMessages: {
                    orderBy: {
                        sendTime: 'desc'
                    },
                    select: {
                        user: {
                            select: {
                                name: true
                            }
                        },
                        content: true,
                        sendTime: true,
                    }
                }
            }
        })

        if (!data) {
            return res.status(400).json({ message: "없는 방입니다." })
        }

        res.status(200).json({ code: 'success', message: " ", data });


    } catch (error) {
        Logger.error(error);
    }
}

export const sendChat = async (req: Request, res: Response) => {

    const messageData: messageData = {
        roomId: req.params.id,
        userId: (req.user as User).user_id,
        content: req.body.content
    };

    try {
        const chat = await prisma.chat_message.create({
            data: {
                user_id: messageData.userId,
                chat_id: messageData.roomId,
                content: messageData.content
            }
        });

        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);

        res.status(200).json({ code: 'success', message: " " });
    } catch (error) {
        Logger.error(error);
    }
}

export const removeRoom = async (req: Request, res: Response) => {
    const roomId: string = req.params.id;

    try {
        await prisma.chat_room.deleteMany({
            where: {
                chat_id: roomId,
            }
        })

        res.status(200).json({ code: 'success', message: " " });

    } catch (error) {
        Logger.error(error);
    }
}

