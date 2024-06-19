import { PagingReq } from "./paging-req";

export interface GetPagedScoreReq extends PagingReq {
    employeeId?: number;

    departmentId: number;
}