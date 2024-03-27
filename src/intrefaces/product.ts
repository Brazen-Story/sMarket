export interface createProduct {
    seller_id: string;
    title: string;
    description: string;
    endDate: string;
    startPrice: number;
    status: ProductStatus;
    images: ImageData;
    categoryId: string;
}

export interface updateProduct {
    title: string;
    description: string;
    endDate: string;
    startPrice: number;
    reservePrice: number;
    status: ProductStatus;
    images: ImageData;
}

export interface pagination {
    userId?: string;
    page: number;
    limit: number;
    status?: string; //전체, 판매중, 팔림
    sort: string; //최신, 고가, 저가
    searchName?: string;
}

export interface PaginationResult {
    totalPage: number;
    paginateData: ProductData[];
}
export interface likePage {
    userId: string;
    page: number;
    limit: number;
}

interface ProductData {
    product_id: string;
    seller_id: string;
    title: string;
    description: string;
    registration_date: string;
    end_date: string;
    start_price: number;
    reserve_price: number | null;
    hammer_price: number | null;
    status: string;
    images: ImageData[];
}

interface ImageData {
    image_1: string;
    image_2?: string;
    image_3?: string;
}

type ProductStatus = "auctionProgress" | "auctionCompleted" | "all";
