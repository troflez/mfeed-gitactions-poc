import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface UserTypeModel extends BaseModel {
    userTypeID: number;
    name: string;
}