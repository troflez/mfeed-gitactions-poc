import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
import { AuthModel } from 'src/app/modules/auth/_models/auth.model';
import { SiteConstants } from 'src/app/helpers/site-constants';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<AuthModel>;
  userType: string;

  private unsubscribe: Subscription[] = [];

  constructor(private layout: LayoutService, private auth: AuthService) {}

  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    this.user$ = this.auth.currentUserSubject.asObservable();
  }

  getUserType(id: number): string {
    return SiteConstants.getUserTypeByID(id);
  }

  logout() {
    const logoutSub = this.auth.logout()
      .subscribe((success: boolean) => {
        if(success)
          document.location.reload();
      });
    //document.location.reload();

    
    this.unsubscribe.push(logoutSub);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
