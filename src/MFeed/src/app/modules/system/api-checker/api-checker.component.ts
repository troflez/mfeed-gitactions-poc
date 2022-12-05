
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { M88APIService } from '../_services/m88-api.service';
import { SportTypeService } from '../../match/_services/sport-type.service';
import { SportTypeModel } from '../../match/_models/sport-type.model';
import { first } from 'rxjs/operators';
import { OddsExtractSettingModel } from '../_models/odds-extract-setting.model';
import { OddsExtractSettingService } from '../_services/odds-extract-setting.service';

@Component({
  selector: 'app-api-checker',
  templateUrl: './api-checker.component.html'
})

export class APICheckerComponent implements OnInit, OnDestroy {
  _isLoading: boolean;
  _formGroup: FormGroup;
  _sportTypeList$ = new BehaviorSubject<SportTypeModel[]>([]);
  _oddsTypeList: string[];
  _oddsExtractSetting: OddsExtractSettingModel[] = [];
  _oddsList$ = new BehaviorSubject<OddsList[]>([]);
  _sportType: string;

  private subscriptions: Subscription[] = [];
  
  constructor(
    private m88APIService: M88APIService,
    private sportTypeService: SportTypeService,
    private oddsExtractSettingService: OddsExtractSettingService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    const sbST = this.sportTypeService.getList().pipe(
      first()
    ).subscribe((res: SportTypeModel[]) => {
      this._sportType = res[0].name;
      this._sportTypeList$.next(res);

      this.loadData();
    });
    this.subscriptions.push(sbST);
  }

  onSportChange(sportType: string){
    this._sportType = sportType;
    this.loadData();
  }

  loadData(){
    this._oddsList$.next([]);

    const sbOddsType = this.oddsExtractSettingService.getOddsExtractSettingList()
      .subscribe((res: OddsExtractSettingModel[]) => {
        let oddsExtractSetting =  res.filter((item) => item.sportType == this._sportType && item.isSelected);

        let oddsList: OddsList[] = [];
        this._oddsList$.next(oddsList);
        for(var i = 0; i < oddsExtractSetting.length; i++){
          let oddsType = oddsExtractSetting[i].oddsType;

          const sb = this.m88APIService.getMatches(this._sportType, oddsType)
          .subscribe((iRes: any) => {
            if(iRes.length > 0){
              let oOddsType = iRes[0].oddsType;

              oddsList.push({
                  oddsType: oOddsType,
                  list:iRes
                });

              this._oddsList$.next(oddsList);
            }
          });
          this.subscriptions.push(sb);
        }
      });
    this.subscriptions.push(sbOddsType);
    
  }

  refresh(){
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}

export interface OddsList{
  oddsType: string,
  list: any
}