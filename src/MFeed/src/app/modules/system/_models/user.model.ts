import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface UserModel extends BaseModel {
    username: string;
    email: string;
    userTypeID: number;
    userType: string;
    userStatusID: number;
    userStatus: string;
    dateCreated: Date;
    createdBy: string;
    lastUpdated: Date;
    lastUpdatedBy: string;
}