import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SiteConstants } from 'src/app/helpers/site-constants';
import { AuthService } from '../../auth';
import { WorkerServiceSessionModel } from '../_models/worker-service-session.model';
import { WorkerServiceSettingModel } from '../_models/worker-service-setting.model';
import { WorkerServiceSessionService } from '../_services/worker-service-session.service';
import { WorkerServiceSettingService } from '../_services/worker-service-setting.service';
import { OddsExtractSettingModel } from '../_models/odds-extract-setting.model';
import { OddsExtractSettingService } from '../_services/odds-extract-setting.service';

@Component({
  selector: 'app-worker-service-setting',
  templateUrl: './worker-service-setting.component.html'
})

export class WorkerServiceSettingComponent implements OnInit, OnDestroy {
  _isLoading: boolean;
  _workerServiceSettingModel: WorkerServiceSettingModel;
  _workerServiceSession$: BehaviorSubject<WorkerServiceSessionModel> = new BehaviorSubject<WorkerServiceSessionModel>({lastPullGLiveMatch: null, lastPullSBFeedMatch: null, lastPullSBFeedOdds: null});
  _formGroup: FormGroup;
  _showMessage$: BehaviorSubject<boolean> = new BehaviorSubject(false);  
  _oddsExtractSetting: OddsExtractSettingModel[] = [];
  _sportTypeList$ = new BehaviorSubject<string[]>([]);
  _oddsTypeList$ = new BehaviorSubject<string[]>([]);

  private subscriptions: Subscription[] = [];
  
  constructor(
    private workerServiceSettingService: WorkerServiceSettingService,
    private workerServiceSessionService: WorkerServiceSessionService,
    private oddsExtractSettingService: OddsExtractSettingService,
    private fb: FormBuilder, 
    public authService: AuthService) { }

  ngOnInit(): void {
    this._workerServiceSettingModel = { sbFeedMatchUpdateIntervalHour: 0, sbFeedOddsUpdateIntervalSec: 0, gLiveMatchUpdateIntervalHour: 0 };
    
    const sb = this.workerServiceSettingService._isLoading$.subscribe(res => this._isLoading = res);
    this.subscriptions.push(sb);

    this.loadData();
    this.loadOddsTypeData();
  }


  loadData() {
    this.loadForm();

    const sb = this.workerServiceSettingService.getWorkerServiceSetting()
      .subscribe((res: WorkerServiceSettingModel) => {
        this._workerServiceSettingModel = res;
        this.fillForm();
      });    
      this.subscriptions.push(sb);

      const sbWSSession = this.workerServiceSessionService.getWorkerServiceSession()
        .subscribe((res: WorkerServiceSessionModel) => {
          this._workerServiceSession$.next(res);
        });
      this.subscriptions.push(sbWSSession);
  }

  loadOddsTypeData(){
    const sbOddsType = this.oddsExtractSettingService.getOddsExtractSettingList()
    .subscribe((res: OddsExtractSettingModel[]) => {          
      this._oddsExtractSetting = res;
      this._sportTypeList$.next(res.filter((item, i, arr) => arr.findIndex(a => a.sportType === item.sportType) === i).map(a => a.sportType));
      this._oddsTypeList$.next(res.filter((item, i, arr) => arr.findIndex(a => a.oddsType === item.oddsType) === i).map(a => a.oddsType));

    });
  this.subscriptions.push(sbOddsType);
  }

  fillForm(){
    this._formGroup.controls["sbFeedMatchUpdateIntervalHour"].setValue(this._workerServiceSettingModel.sbFeedMatchUpdateIntervalHour);
    this._formGroup.controls["sbFeedOddsUpdateIntervalSec"].setValue(this._workerServiceSettingModel.sbFeedOddsUpdateIntervalSec);
    this._formGroup.controls["gLiveMatchUpdateIntervalHour"].setValue(this._workerServiceSettingModel.gLiveMatchUpdateIntervalHour);
  }

  loadForm() {
    this._formGroup = this.fb.group({
      sbFeedMatchUpdateIntervalHour: [this._workerServiceSettingModel.sbFeedMatchUpdateIntervalHour, Validators.compose([Validators.required])],
      sbFeedOddsUpdateIntervalSec: [this._workerServiceSettingModel.sbFeedOddsUpdateIntervalSec, Validators.compose([Validators.required])],
      gLiveMatchUpdateIntervalHour: [this._workerServiceSettingModel.gLiveMatchUpdateIntervalHour, Validators.compose([Validators.required])]
    });
  }

  reset(){
    this._showMessage$.next(false);
    this.loadForm();
  }

  save() {
    this._showMessage$.next(false);
    this.prepareData();
    
    const sb = this.workerServiceSettingService.updateWorkerServiceSetting(this._workerServiceSettingModel)
      .subscribe(res => {
        this._showMessage$.next(true);
      });
    
    this.subscriptions.push(sb);
  }

  saveOT(){    
    let list: OddsExtractSettingModel[] = this._oddsExtractSetting.filter(a => a.isSelected);

    const sb = this.oddsExtractSettingService.batchUpdate(list)
      .subscribe(res => {
        this._showMessage$.next(true);
      });    
    this.subscriptions.push(sb);
  }

  resetOT(){
    this.loadOddsTypeData();
  }

  findSetting(sportType: string, oddsTypes: string){
    return this._oddsExtractSetting.filter(a => a.sportType == sportType && a.oddsType == oddsTypes);
  }

  private prepareData() {
    const formData = this._formGroup.value;
    this._workerServiceSettingModel.sbFeedMatchUpdateIntervalHour = formData.sbFeedMatchUpdateIntervalHour;
    this._workerServiceSettingModel.sbFeedOddsUpdateIntervalSec = formData.sbFeedOddsUpdateIntervalSec;
    this._workerServiceSettingModel.gLiveMatchUpdateIntervalHour = formData.gLiveMatchUpdateIntervalHour;
  }

  public get MODULE(): typeof SiteConstants.MODULE {
    return SiteConstants.MODULE; 
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this._formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this._formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this._formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this._formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
