import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface MatchModel extends BaseModel {
    matchID: number;
    gLiveMatchID: number;
    tournament: string;
    homeTeam: string;
    homeTeamIcon: string;
    awayTeam: string;
    awayTeamIcon: string;
    sportType: string;
    matchDate: Date;
    channel: number;
    isPublishedM88: boolean;
    isPublishedMGoal88: boolean;
    dateCreated: Date;
    lastUpdateDate: Date;
    lastUpdatedBy: string;
    matchGroup: string;
}