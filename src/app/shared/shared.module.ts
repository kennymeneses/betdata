import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';



@NgModule({
  declarations: [
    ToolbarComponent,
    SidenavComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
