export class AuthContext {
    public userId: number | undefined;

    public avatar: string | undefined;

    public userName: string | undefined;

    public email: string | undefined;

    public token: string | undefined;

    public roles: string[] = [];
}