import { ScoreDataTableDetail } from "./score-data-table-detail";

export interface ScoreTableData {
    email: string;

    avatar: string;

    userId: number;

    scoreArray: ScoreDataTableDetail[];
}