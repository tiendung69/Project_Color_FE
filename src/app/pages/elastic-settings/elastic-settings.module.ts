import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElasticSettingsComponent } from './elastic-settings/elastic-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from 'src/app/core/services/guard.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/components/shared.module';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { DialogAllModule } from '@syncfusion/ej2-angular-popups';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Elastic' },
    children: [
      {
        path: '',
        component: ElasticSettingsComponent,
        data: { breadcrumb: 'Elastic' },
      },
    ],
  },
];

@NgModule({
  declarations: [ElasticSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    GridAllModule,
    DialogAllModule,
    TextBoxAllModule,
    DropDownListAllModule,
    NgbModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
  ],
})
export class ElasticSettingsModule {}
