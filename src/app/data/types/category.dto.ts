export interface CategoryDto {
    id?: number;

    name: string;

    organizationId: number;

    weighting?: number;

    parentId?: number;

    createdDate?: Date;

    modifiedDate?: Date;
}