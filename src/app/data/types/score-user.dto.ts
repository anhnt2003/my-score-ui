import { ScoreDto } from "./score.dto";

export interface ScoreUserDto {
    userId: number;

    userName: string;

    profilePicture: string;

    email: string;

    scores: ScoreDto[];
}