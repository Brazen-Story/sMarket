export interface User {
    user_id: string;
    name: string;
    phone_number: number;
    address: string;
    email: string;
    password: string;
    images: ImageData;
    biography: string | null;
}

interface ImageData {
    profileImage?: string | null;
    backgroundImage?: string | null;
}

export interface Register {
    name: string;
    phone_number: number;
    address: string;
    email: string;
    password: string;
}

export interface Login {
    email: string;
    password: string;
}

export interface JwtPayload {
    sub: string;
    iat?: number;
    exp: number;
    aud?: string;
    iss: string;
}

export interface JwtUserInfo {
    user_id: string;
    email: string;
}

export interface UserUpdate {
    user_id: string;
    name?: string;
    biography?: string;
    address?: string;
    images: ImageData;
}

