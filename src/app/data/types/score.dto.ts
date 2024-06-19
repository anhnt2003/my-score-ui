export interface ScoreDto {
    id: number;

    userId: number;

    departmentId: number;

    scoreCalculated: number;

    scoreEntered: number;

    categoryId: number;

    parentId: number;
    
    categoryName: string;

    createdDate: Date;

    modifiedDate?: Date;

    reviewBy: number;
}