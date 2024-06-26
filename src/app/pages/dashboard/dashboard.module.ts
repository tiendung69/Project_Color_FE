import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { DashboardComponent } from './dashboard.component';
import { InfoPanelsComponent } from './info-panels/info-panels.component';
import { VisitorsComponent } from './visitors/visitors.component';
import { CostComponent } from './cost/cost.component';
import { InfoCardsComponent } from './info-cards/info-cards.component';
import { DiskSpaceComponent } from './disk-space/disk-space.component';
import { TodoComponent } from './todo/todo.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgScrollbarModule,
    NgxChartsModule,
    DirectivesModule,
  ],
  declarations: [
    DashboardComponent,
    InfoPanelsComponent,
    VisitorsComponent,
    CostComponent,
    InfoCardsComponent,
    DiskSpaceComponent,
    TodoComponent,
  ],
})
export class DashboardModule {}
