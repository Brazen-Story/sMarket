export interface ProductRequest {
    seller_id: string;
    title: string;
    description: string;
    endDate: string; // Consider using a more appropriate date type
    startPrice: number;
    status: ProductStatus;
    images: ImageUrls;
}

interface ImageUrls {
    image_1: string;
    image_2?: string;
    image_3?: string;
}

type ProductStatus = "경매 중" | "숨기기" | "경매완료";
