import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'report', component:ReportFormComponent},
  { path: 'report/:id', component: ReportComponent },

];


@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: "enabled"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
