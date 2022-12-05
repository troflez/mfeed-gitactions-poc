import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LayoutService } from '../../../../_metronic/core';
import KTLayoutFooter from '../../../../../assets/js/layout/base/footer';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, AfterViewInit {
  footerContainerCSSClasses: string;
  currentYear: string;
  version: string;

  constructor(private layout: LayoutService) {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear().toString();

    this.version = environment.appVersion;
  }

  ngOnInit(): void {
    this.footerContainerCSSClasses = this.layout.getStringCSSClasses(
      'footer_container'
    );
  }

  ngAfterViewInit() {
    // Init Footer
    KTLayoutFooter.init('kt_footer');
  }
}
