import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface MatchLogModel extends BaseModel {
    matchID: number;
    actionBy: string;
    action: string;
    detail: string;
    logDate: Date;
}