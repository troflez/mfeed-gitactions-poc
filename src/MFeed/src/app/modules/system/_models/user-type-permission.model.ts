export interface UserTypePermissionModel{
    userTypePermissionID: number,
    userTypeID: number,
    moduleID: number,
    module: string,
    read: boolean,
    write: boolean
}