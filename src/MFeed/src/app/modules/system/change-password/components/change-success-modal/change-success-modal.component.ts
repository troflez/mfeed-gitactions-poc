import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/_services/auth.service';
@Component({
  selector: 'app-change-success-modal',
  templateUrl: './change-success-modal.component.html',
})
export class ChangeSuccessModalComponent implements OnInit {

  private unsubscribe: Subscription[] = [];

  constructor(private authService: AuthService, public modal: NgbActiveModal){
    
  }

  ngOnInit(): void {
  }

  ok(): void{
    const logoutSub = this.authService.logout()
      .subscribe((success: boolean) => {
        if(success){
          this.modal.close();
          document.location.reload();
        }
      });

    this.unsubscribe.push(logoutSub);    
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
