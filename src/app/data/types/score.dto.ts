export interface ScoreDto {
    id: number;

    userId: number;

    email: string;

    avatar: string;

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