import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface LanguageModel extends BaseModel {
    languageID: number;
    name: string;
    code: string;
}