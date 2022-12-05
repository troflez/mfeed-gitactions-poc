import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface DomainWhitelistModel extends BaseModel {
    domainWhitelistID: number;
    name:string;
}