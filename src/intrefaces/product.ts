export interface createProduct {
    seller_id: string;
    title: string;
    description: string;
    endDate: string;
    startPrice: number;
    status: ProductStatus;
    images: ImageUrls;
}

export interface updateProduct{
    title: string;
    description: string;
    endDate: string;
    startPrice: number;
    reservePrice: number;
    status: ProductStatus;
    images: ImageUrls;
}

interface ImageUrls {
    image_1: string;
    image_2?: string;
    image_3?: string;
}

type ProductStatus = "경매 중" | "숨기기" | "경매완료";
