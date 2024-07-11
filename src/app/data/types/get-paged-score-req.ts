import { PagingReq } from './paging-req';

export interface GetPagedScoreReq extends PagingReq {
    departmentId: number;

    sortField?: string;

    sortOrder?: string;
}