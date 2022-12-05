import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface GLiveMatchModel extends BaseModel {
    gLiveMatchID: number;
    tournament: string;
    homeTeam: string;
    awayTeam: string;
    sportType: string;
    timeStart: Date;
    timeEnd: Date;
    channel: number;
    nowPlaying: boolean;
    isLive: boolean;
}