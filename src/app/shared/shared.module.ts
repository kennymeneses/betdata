import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MaterialModule } from './material/material.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
export { TeamModel } from './models/team.model';
export { MatchDetailModel } from './models/matchdetails.model'
import { HttpClientModule } from '@angular/common/http';
import { InfomatchComponent } from './components/infomatch/infomatch.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    HttpClientModule
  ],
  declarations: [ToolbarComponent, SidenavComponent, InfomatchComponent],
  exports : [
    ToolbarComponent,
    SidenavComponent,
    InfomatchComponent
  ],
  entryComponents : [InfomatchComponent]
})
export class SharedModule { }
