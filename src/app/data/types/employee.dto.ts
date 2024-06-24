export interface EmployeeDto {
    id: number;

    userId: number;

    email: string;

    avatar: string;

    departmentId: number;

    jobTitle: string;

    permission: string[];

    createdDate: Date;

    modifiedDate?: Date;
}