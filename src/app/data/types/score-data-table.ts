export interface ScoreTableData {
    email: string;

    avatar: string;

    userId: number;

    scoreArray:
    {
        categoryName: string;

        categoryId: number;

        scoreCalculated: number;
    }[];
}