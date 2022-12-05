import { SafeResourceUrl } from '@angular/platform-browser';
import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface TeamModel extends BaseModel {
    teamID: number;
    leagueID: number;
    displayName: string;
    sbFeedKey: string;
    icon: string;
    iconFile: File;
    iconURL: SafeResourceUrl;
}