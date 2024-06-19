export interface EmployeeDto {
    id: number;

    userId: number;

    departmentId: number;

    jobTitle: string;

    permission: string[];

    createdDate: Date;

    modifiedDate?: Date;
}