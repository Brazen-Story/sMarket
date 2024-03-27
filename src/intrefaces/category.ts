export interface Category{
    category_id: string;
    name: string;
    depth: number;
    children?: Category[]; 
}