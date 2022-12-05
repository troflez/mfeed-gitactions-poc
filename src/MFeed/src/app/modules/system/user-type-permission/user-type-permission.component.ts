import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { KeyValuePair, SiteConstants } from 'src/app/helpers/site-constants';
import { AuthService } from '../../auth';
import { UserTypePermissionModel } from '../_models/user-type-permission.model';
import { CacheRefreshService } from '../_services/cache-refresh.service';
import { UserTypePermissionService } from '../_services/user-type-permission.service';
import { SportTypeService } from '../../match/_services/sport-type.service';
import { UserTypeService } from '../_services/user-type.service';
import { SportTypeModel } from '../../match/_models/sport-type.model';
import { UserTypeModel } from '../_models/user-type.model';

@Component({
  selector: 'app-user-type-permission',
  templateUrl: './user-type-permission.component.html'
})
export class UserTypePermissionComponent implements OnInit, OnDestroy {
  _isLoading: boolean;
  _userTypePermissionList: UserTypePermissionModel[];
  _items$ = new BehaviorSubject<UserTypePermissionModel[]>([]);
  _sportPermissions$ = new BehaviorSubject<UserTypeSportType[]>([]);
  _userTypeList$ = new BehaviorSubject<UserTypeModel[]>([]);
  _filterGroup: FormGroup;
  _moduleList: KeyValuePair[];
  _showMessage$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  _userTypeID: number;

  private subscriptions: Subscription[] = [];
  
  constructor(
    private userTypePermissionService: UserTypePermissionService,
    private sportTypeService: SportTypeService,
    private userTypeService: UserTypeService,
    private fb: FormBuilder, 
    public authService: AuthService,
    private cacheRefreshService: CacheRefreshService
    ) { }

  ngOnInit(): void {
    const sb = this.userTypePermissionService._isLoading$.subscribe(res => this._isLoading = res);
    this.subscriptions.push(sb);

    const sbUT = this.userTypeService.getList().pipe(
      first()
    ).subscribe((res: UserTypeModel[]) => {
      this._userTypeList$.next(res);

      //Superuser
      this._userTypeID = 1; 
      this.loadSportData();
    });
    this.subscriptions.push(sbUT);

    this._moduleList = SiteConstants.getModuleList();
    
    this.filterForm();
    this.loadModuleData();
  }

  filterForm() {
    this._filterGroup = this.fb.group({
      userTypeID: 1 //default
    });

    this.subscriptions.push(
      this._filterGroup.controls.userTypeID.valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged()
      ).subscribe(() =>
      {
        this._showMessage$.next(false);

        this._userTypeID = this._filterGroup.controls.userTypeID.value;

        this.loadModuleData();
        this.loadSportData();
      }
      )
    );
  }

  loadSportData(){
    const sb = this.sportTypeService.getList()
      .subscribe((res: SportTypeModel[]) => {
          this.fillSportTypeForm(res);
      });    
      this.subscriptions.push(sb);
  }

  fillSportTypeForm(list: SportTypeModel[]){
    let userTypeSportTypeList: UserTypeSportType[] = [];

    list.forEach(function(value){
      let newItem: UserTypeSportType = {
        sportTypeID: value.id,
        name: value.name,
        isSelected: false
      };
      userTypeSportTypeList.push(newItem);
    });

    //apply current permission
    const sb = this.userTypeService.getUserTypeSportList(this._userTypeID)
      .subscribe((res: SportTypeModel[]) => {
        res.forEach(function(item){
          let sportItem = userTypeSportTypeList.find(x => x.sportTypeID == item.id);
          if(sportItem){
            sportItem.isSelected = true;
          }
        });
        
        this._sportPermissions$.next(userTypeSportTypeList);
      });    
      this.subscriptions.push(sb);
  }

  loadModuleData() {
    const sb = this.userTypePermissionService.getUserTypePermission(this._filterGroup.controls.userTypeID.value)
      .subscribe((res: UserTypePermissionModel[]) => {
          this._userTypePermissionList = res;
          this.fillModuleForm();
      });    
      this.subscriptions.push(sb);
  }

  fillModuleForm(){
    let items: UserTypePermissionModel[] = []; 
    for(let i = 0; i<this._moduleList.length;i++){
      let moduleID: number = this._moduleList[i].key;

      let item: UserTypePermissionModel = { 
        moduleID: moduleID,
        read: false,
        write: false,
        userTypePermissionID: 0,
        userTypeID: 0,
        module: ''
      };
      
      for(let ii = 0; ii < this._userTypePermissionList.length; ii++){
        if(this._userTypePermissionList[ii].moduleID == moduleID){
          item.userTypePermissionID = this._userTypePermissionList[ii].userTypePermissionID;
          item.read = this._userTypePermissionList[ii].read;
          item.write = this._userTypePermissionList[ii].write;
          item.userTypeID = this._userTypePermissionList[ii].userTypeID;
        }
      }
      
      item.module = SiteConstants.getModuleByID(moduleID);
      item.userTypeID = this._filterGroup.controls.userTypeID.value;

      items.push(item);
    }

    this._items$.next(items);
  }

  reset(){
    this._showMessage$.next(false);
    this.fillModuleForm();
  }

  save() {
    this._showMessage$.next(false);

    this.saveModulePermission();
    this.saveSportPermission();
  }

  saveSportPermission(){
    console.log(this._sportPermissions$.value);

    let sportPermissions = this._sportPermissions$.value.filter(x => x.isSelected);
    let ids: number[] = [];
    sportPermissions.forEach(function(item){
      ids.push(item.sportTypeID);
    });    

    console.log(sportPermissions);
    console.log(ids);

    const sb = this.userTypeService.updateUserTypeSport(this._userTypeID, ids)
      .subscribe(res => {
        this._showMessage$.next(true);
      });    
    this.subscriptions.push(sb);
  }

  saveModulePermission(){ 
    const sb = this.userTypePermissionService.updateUserTypePermission(this._items$.value)
      .subscribe(res => {
        this._showMessage$.next(true);
      });    
    this.subscriptions.push(sb);
  }

  refreshCache(){
    const sb = this.cacheRefreshService.userTypePermissionRefresh(this._filterGroup.controls.userTypeID.value)
      .subscribe();
  }

  public get MODULE(): typeof SiteConstants.MODULE {
    return SiteConstants.MODULE; 
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}

export interface UserTypeSportType {
  sportTypeID: number;
  name: string;
  isSelected: boolean;
}