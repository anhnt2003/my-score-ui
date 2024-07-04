export interface CategoryDto {
    id?: number;

    name: string;

    departmentId: number;

    weighting?: number;

    parentId?: number;

    createdDate?: Date;

    modifiedDate?: Date;

    children?: CategoryDto[];
}