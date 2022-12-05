enum USERSTATUS{
    Active = 1,
    Deactivated = 2,
    Locked = 3
}

enum USERTYPE{
    Superuser = 1,
    Admin = 2,
    Web = 3,
    Marketing = 4,
    Officer = 5
}

enum MODULE{
    UserManagement = 1,
    WorkerServiceSetting = 2,
    UserTypePermission = 3,
    SBFeedMatches = 4,
    GLiveMatches = 5,
    WorkerServiceSession = 6,
    APIClient = 7,
    League = 8,
    Team = 9,
    Language = 10,
    MatchGroup = 11,
    OddsType = 12,
    SportType = 13,
    OddsExtractSetting = 14,
    UserType = 15
}

export class SiteConstants{
    public static get USERTYPE(): typeof USERTYPE
    {
        return USERTYPE;
    }

    public static get MODULE(): typeof MODULE
    {
        return MODULE;
    }

    public static getUserStatusList(): KeyValuePair[]{
        const list: KeyValuePair[] = [];
        let index: number = 0;

        Object.keys(USERSTATUS).forEach((item) => {
            if(isNaN(Number(item))){
                list[index] = new KeyValuePair(this.getUserStatusByName(item), item);
                index++;
            }
        });
        
        return list;
    }

    public static getUserTypeList(): KeyValuePair[]{
        const list: KeyValuePair[] = [];
        let index: number = 0;

        Object.keys(USERTYPE).forEach((item) => {
            if(isNaN(Number(item))){
                list[index] = new KeyValuePair(this.getUserTypeByName(item), item);
                index++;
            }
        });
        
        return list;
    }

    public static getModuleList(): KeyValuePair[]{
        const list: KeyValuePair[] = [];
        let index: number = 0;

        Object.keys(MODULE).forEach((item) => {
            if(isNaN(Number(item))){
                list[index] = new KeyValuePair(this.getModuleByName(item), item);
                index++;
            }
        });
        
        return list;
    }

    public static getUserTypeByID(id: number): string{
        return USERTYPE[id]
    }

    public static getUserTypeByName(name: string): number{
        return USERTYPE[name]
    }

    public static getUserStatusByID(id: number): string{
        return USERSTATUS[id]
    }
    
    public static getUserStatusByName(name: string): number{
        return USERSTATUS[name]
    }

    public static getModuleByID(id: number): string{
        return MODULE[id]
    }

    public static getModuleByName(name: string): number{
        return MODULE[name]
    }
}

export class KeyValuePair{
    key: number;
    value: string;

    constructor(key: number, value: string){
        this.key = key;
        this.value = value;
    }
}
