import { PermissionModel } from "./permission-model";

export class AuthModel {
  username: string;
  userTypeID: number;
  email: string;
  authToken: string;
  permissionList: PermissionModel[];

  setAuth(auth: any) {
    this.username = auth.username;
    this.userTypeID = auth.userTypeID;
    this.email = auth.email;
    this.authToken = auth.authToken;
  }
}
