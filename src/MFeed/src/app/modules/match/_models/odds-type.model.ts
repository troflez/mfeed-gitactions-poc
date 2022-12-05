import { BaseModel } from "src/app/_metronic/shared/crud-table";

export interface OddsTypeModel extends BaseModel {
    oddsTypeID: number,
    name: string,
    code: string,
    isActive: boolean
}