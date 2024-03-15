export interface User {
    user_id: string;
    name: string;
    phoneNumber: number;
    address: string;
    email: string;
    password: string;
}

export interface Register {
    name: string;
    phoneNumber: number;
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
    iss?: string;
}
