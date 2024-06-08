export interface OrganizationUserDto {
    data: OrganizationUserDto[];
    
    id: number;

    userId: number;

    organizationCode: string;

    userName: string;

    email: string;

    organizationId: number;

    organizationName: string;

    evaluationStatus: number;

    positionTitle: string;

    profilePicture: string;
}