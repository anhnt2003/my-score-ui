export interface ScoreDto {
    id: number;

    userId: number;

    organizationId: number;

    scoreCaculated: number;

    scoreEntered: number;

    categoryId: number;
    
    categoryName: string;

    createdDate: Date;

    modifiedDate?: Date;

    reviewBy: number;
}