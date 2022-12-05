
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CacheCheckerService } from '../_services/cache-checker.service';

@Component({
  selector: 'app-cache-checker',
  templateUrl: './cache-checker.component.html'
})

export class CacheCheckerComponent implements OnInit, OnDestroy {
  _isLoading: boolean;
  _formGroup: FormGroup;
  _key: string = "";
  _jsonValue: string = "";

  private subscriptions: Subscription[] = [];
  
  constructor(
    private cacheCheckerService: CacheCheckerService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadData();
  }
  
  loadData() {
    const sb = this.cacheCheckerService.getCache(this._key)
      .subscribe((res: any) => {
        this._jsonValue =  JSON.stringify(res);
      });    
      this.subscriptions.push(sb);
  }

  refresh(){
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
