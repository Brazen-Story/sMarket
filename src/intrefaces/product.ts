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

export interface queryProduct{
    page: number;
    limit : number;
    status: string;
    sort: string;
    searchName: string;
}

export interface PaginationResult {
    totalPage?: number;
    paginateData?: any[

    ]; // 실제 데이터 타입으로 대체하세요.
    // 여기에 더 많은 프로퍼티를 추가할 수 있습니다.
  }
interface ImageUrls {
    image_1: string;
    image_2?: string;
    image_3?: string;
}

type ProductStatus = "경매 중" | "숨기기" | "경매완료";
