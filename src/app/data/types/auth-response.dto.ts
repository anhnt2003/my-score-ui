export interface AuthResponseDto {
    userId: number;

    userName: string;

    email: string;

    token: string;

    roles: string[];
}