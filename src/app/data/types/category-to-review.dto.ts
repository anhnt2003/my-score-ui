import { CategoryDto } from "./category.dto";

export interface CategoryToReviewDto {
    id?: number;

    name: string;

    organizationId: number;

    weighting?: number;

    parentId?: number;

    createdDate?: Date;

    modifiedDate?: Date;

    categoryChildren: CategoryDto[]
}