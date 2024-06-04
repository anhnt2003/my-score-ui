import { CategoryDto } from "./category.dto";

export interface CategoryResponseDto {
    data: CategoryDto[],

    total: number
}