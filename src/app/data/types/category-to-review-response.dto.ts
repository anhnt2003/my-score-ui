import { CategoryToReviewDto } from "./category-to-review.dto";

export interface CategoryToReviewResponseDto {
    data: CategoryToReviewDto[],

    total: number
}