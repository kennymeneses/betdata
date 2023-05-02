import { Component, inject, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatInput } from '@angular/material/input';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSidenav } from '@angular/material/sidenav';
import { TeamModel } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @Input() sidenav!: MatSidenav;
  http = inject(HttpClient);

  dataSource: TeamModel[] = [];
  dataStored: TeamModel[] = [];
  dataTemp : TeamModel[] = [];

  arrTournaments : string[] = [];

  imgTeamsrc! : string;
  countryTeam! : string;
  

  teamSelected! : TeamModel;

  @ViewChild('inputSearch', { static: true }) inputSearch!: ElementRef;
  @ViewChild('matCardTitle', { static: true }) matCardTitle!: ElementRef;
  @ViewChild('imgLogoTeam', { static: true }) imgLogoTeam!: ElementRef;

  ngOnInit(): void{  

    this.http.get<TeamModel[]>('./../../../assets/teams.json')
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
    this.teamSelected = event.option.value;

    this.getData(this.teamSelected.idTeam);
  }

  getData(idTeam: number)
  {
    let urlGetTeamById = 'https://api-football-v1.p.rapidapi.com/v3/teams?id=' + idTeam.toString();

    if(localStorage.getItem(urlGetTeamById) !== null)
    {
      console.log(urlGetTeamById + " SI se encuentra en localstorage");

      let jsonResponse = JSON.parse(localStorage.getItem(urlGetTeamById)!);
      console.log(jsonResponse);

      this.loadMainData(jsonResponse)
    }
    else
    {
      console.log(urlGetTeamById + " NO se encuentra en el localStorage");

      const headers = new HttpHeaders()
      .set('X-RapidAPI-Key', '8201a5f973msh5d4fd471f4ab4d3p104801jsn8c07ee654921')
      .set('X-RapidAPI-Host', 'api-football-v1.p.rapidapi.com');

      this.http.get('https://api-football-v1.p.rapidapi.com/v3/teams?id='+ idTeam.toString(), { headers })
      .subscribe((data: any) => 
                {   
                    console.log(data.response[0]);
                    this.loadMainData(data.response[0]);
                    localStorage.setItem(urlGetTeamById, JSON.stringify(data.response[0]))
                });

      this.http.get('https://api-football-v1.p.rapidapi.com/v3/leagues?team='+idTeam.toString(), {headers} )
      .subscribe((data: any) =>
                {

                });
    }
  }

  //https://api-football-v1.p.rapidapi.com/v3/teams?id=2553
  //https://api-football-v1.p.rapidapi.com/v3/leagues?team=2553 get las ligas de un equipo
  //https://api-football-v1.p.rapidapi.com/v3/players/squads?team=529 todos los players del equipo
  //https://api-football-v1.p.rapidapi.com/v3/coachs?team=2553
  //https://api-football-v1.p.rapidapi.com/v3/standings?season=2023&league=281  get info de todos los equipos de una liga del tal año
  //https://api-football-v1.p.rapidapi.com/v3/teams/statistics?league=39&season=2022&team=33

  //https://www.thesportsdb.com/api.php

  //
  loadMainData(team: any)
  {
    this.imgTeamsrc = team.team.logo;
    this.countryTeam = team.team.country;
  }

  loadTournaments(team: any)
  {

  }
}
