import { Component, inject, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  @ViewChild('inputSearch', { static: true }) inputSearch!: ElementRef;

  dataSource: TeamModel[] = [];
  dataStored: TeamModel[] = [];
  dataTemp : TeamModel[] = [];


  ngOnInit(): void{  

    this.http.get<TeamModel[]>('./../../../../assets/teams.json')
      .subscribe((data:TeamModel[]) => 
      {
        this.dataSource = data;
        this.dataTemp = this.dataSource;

        console.log(this.dataTemp);
      })

  }

  onKeyUp(value: any)
  {
    if(value.target.value == '' || value.target.value == null)
    {
      this.dataStored = [];
      this.dataTemp = this.dataSource;
    }

    if(value.target.value.toString().length >=3)
    {
      let text: string = value.target.value.toString();

      const words = text.split(' ');
  
      if(words.length > 1)
      {
        const regex = new RegExp(words.map(word => `(?=.*${word})`).join(''), 'gi');
        this.dataTemp = this.dataTemp.filter((team) => 
        {
          return regex.test(team.teamName);
        });

        this.dataStored = this.dataTemp;
      }
      else 
      {
        const regex = new RegExp(text, 'i');
        this.dataTemp = this.dataTemp.filter(team => regex.test(team.teamName));
        this.dataStored = this.dataTemp;
      }
    }
  }

  onCancel(value: any)
  {
    this.dataStored = [];
    this.inputSearch.nativeElement.value = '';
    this.dataTemp = this.dataSource;    
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent)
  {
    setTimeout(() => {
      this.inputSearch.nativeElement.blur();
    }, 100);

    this.inputSearch.nativeElement.value = event.option.value.teamName;
  }
}
