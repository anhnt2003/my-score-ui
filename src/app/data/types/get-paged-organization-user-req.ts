import { PagingReq } from "./paging-req";

export interface GetPagedOrganizationUserReq extends PagingReq {
    userId?: number;

    organizationId?: number;
}