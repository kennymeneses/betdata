import { Component, inject, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatInput } from '@angular/material/input';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TeamModel } from '../../shared.module';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() sidenav!: MatSidenav;
  http = inject(HttpClient);

  ngOnInit(): void{  

  }
}
