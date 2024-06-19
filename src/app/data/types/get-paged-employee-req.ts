import { PagingReq } from "./paging-req";

export interface GetPagedEmployeeReq extends PagingReq {
    departmentId?: number;
}