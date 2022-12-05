import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface SportTypeModel extends BaseModel {
    sportTypeID: number;
    name: string;
    spid: number;
    isActive: boolean;
}