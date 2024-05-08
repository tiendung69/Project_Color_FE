import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/components/shared.module';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'ADMIN_NAV.SEARCH' },
    children: [
      {
        path: '',
        component: SearchComponent,
        data: { breadcrumb: 'ADMIN_NAV.SEARCH' },
      },
    ],
    // canActivate: [GuardService],
  },
];
@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    GridAllModule,
    FormsModule,
    TranslateModule,
    NgbModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class SearchModule {}
