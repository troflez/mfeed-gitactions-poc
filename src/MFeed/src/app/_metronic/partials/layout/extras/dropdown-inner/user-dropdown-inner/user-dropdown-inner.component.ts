import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../../../../core';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
import { AuthModel } from 'src/app/modules/auth/_models/auth.model';
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  user$: Observable<AuthModel>;
  role: string;

  constructor(private layout: LayoutService, private auth: AuthService) {}

  ngOnInit(): void {
    this.extrasUserDropdownStyle = this.layout.getProp(
      'extras.user.dropdown.style'
    );
    this.user$ = this.auth.currentUserSubject.asObservable();
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
