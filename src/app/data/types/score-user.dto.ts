import { ScoreDto } from "./score.dto";

export interface ScoreUserDto {
    userId: number;

    userName: string;

    profilePicture: string;

    email: string;

    positionTitle: string;

    evaluationStatus: number;

    scores: ScoreDto[];
}