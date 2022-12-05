import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface LeagueModel extends BaseModel {
    leagueID: number;
    displayName: string;
    sbFeedKey: string;
    icon: string;
    iconFile: File;
    iconDark: string;
    iconDarkFile: File;
}