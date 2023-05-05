import { Component, inject, Input, OnInit, ViewChild,AfterViewInit, ElementRef } from '@angular/core';
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
import { MatTable } from '@angular/material/table';
import { CdkTable, RowOutlet } from '@angular/cdk/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  @Input() sidenav!: MatSidenav;
  http = inject(HttpClient);


  dataSource: TeamModel[] = [];
  dataStored: TeamModel[] = [];
  dataTemp : TeamModel[] = [];

  arrTeamsLeague : any[] = [];
  displayedColumns: string[] = ['Nombre', 'Racha', 'Jugados', 'Puntos'];

  arrLastResults : any[] = [];
  displayedColumnsResults : string[] = ['Fecha', 'Torneo', 'Equipo Local', 'Resultado', 'Equipo Visitante', 'Action'];

  teamName! : string;
  imgTeamsrc! : string;
  countryTeam! : string;
  localLeagueTeam! : string;

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
    this.arrTeamsLeague = [];  
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent)
  {
    setTimeout(() => {
      this.inputSearch.nativeElement.blur();
    }, 100);

    this.inputSearch.nativeElement.value = event.option.value.teamName;
    this.teamSelected = event.option.value;

    this.getData(this.teamSelected);
  }

  getData(_teamSelected: TeamModel)
  {
    let urlGetTeamById = 'https://www.thesportsdb.com/api/v1/json/60130162/lookupteam.php?id=' + _teamSelected.idTeam.toString();

    if(localStorage.getItem(urlGetTeamById) !== null)
    {
      console.log(urlGetTeamById + " SI se encuentra en localstorage");

      let jsonResponse = JSON.parse(localStorage.getItem(urlGetTeamById)!);

      this.imgTeamsrc = jsonResponse.strTeamBadge;
      this.localLeagueTeam = jsonResponse.idLeague;
      this.teamName = jsonResponse.strTeam;
      console.log(jsonResponse);

      console.log(_teamSelected.idTeam.toString());
      this.loadMainData(_teamSelected);
    }
    else
    {
      console.log(urlGetTeamById + " NO se encuentra en el localStorage");
      console.log(_teamSelected.idTeam);

      this.http.get('https://www.thesportsdb.com/api/v1/json/60130162/lookupteam.php?id='+ _teamSelected.idTeam)
      .subscribe((data: any) => 
                {   
                    console.log("Data Recibida");
                    console.log(data);
                    console.log("Equipo Seleccionado");
                    console.log(data.teams[0]);
                    this.loadMainData(_teamSelected);
                    localStorage.setItem(urlGetTeamById, JSON.stringify(data.teams[0]));
                    
                    this.localLeagueTeam = data.teams[0].idLeague;
                    this.imgTeamsrc = data.teams[0].strTeamBadge;
                    this.teamName = data.teams[0].strTeam;
                });
    }
  }
  //https://www.thesportsdb.com/api/v1/json/60130162/searchevents.php?e=Real_Madrid_vs_Ath_Madrid
  //https://www.thesportsdb.com/api/v1/json/60130162/eventslast.php?id=133602  last events by teamId
  //https://www.thesportsdb.com/api/v1/json/60130162/lookupeventstats.php?id=1032723
  loadMainData(_teamSelected: TeamModel)
  {
    console.log("estoy en loadMainData");
    console.log(_teamSelected);

    this.http.get('https://www.thesportsdb.com/api/v1/json/60130162/eventslast.php?id='+ _teamSelected.idTeam)
    .subscribe((data: any) => 
              {   
                  this.arrLastResults = data.results;
                  console.log("last 5 events");
                  console.log(data.results);                  
              });

    this.http.get('https://www.thesportsdb.com/api/v1/json/60130162/lookup_all_players.php?id='+ _teamSelected.idTeam)
    .subscribe((data: any) => 
              {   
                  console.log("Former Team");
                  console.log(data);                  
              });

    console.log('https://www.thesportsdb.com/api/v1/json/60130162/lookuptable.php?l='+_teamSelected.idlocalLeague +'&s='+ _teamSelected.season);
    this.http.get('https://www.thesportsdb.com/api/v1/json/60130162/lookuptable.php?l='+_teamSelected.idlocalLeague +'&s='+ _teamSelected.season)
    .subscribe((data: any) => 
              {   
                  this.arrTeamsLeague = [];
                  this.arrTeamsLeague = data.table;              
              });
    //https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php?id=

    //https://www.thesportsdb.com/api/v1/json/60130162/eventslast.php?id=133602
    //https://www.thesportsdb.com/api/v1/json/60130162/lookuptable.php?l=4328&s=2022-2023  posiciones premier
  }

  isSpecialRow(data: any): boolean
  {
    return data === this.teamName;
  }

  SetBackgroundColorVictory(data: any) :boolean
  {
    if(this.teamName == data.strHomeTeam)
    {
      if(parseInt(data.intHomeScore) > parseInt(data.intAwayScore))
      {
        return true;
      }
    }
    else
    {
      if(parseInt(data.intAwayScore) > parseInt(data.intHomeScore))
      {
        return true;
      }
    }
    return false;
  }

  SetBackgroundColorDraw(data: any):boolean
  {
    if(parseInt(data.intHomeScore) == parseInt(data.intAwayScore))
    {
      return true;
    }

    return false;
  }

  SetBackgroundColorDefeat(data: any):boolean
  {
    if(this.teamName == data.strHomeTeam)
    {
      if(parseInt(data.intHomeScore) < parseInt(data.intAwayScore))
      {
        return true;
      }
    }
    else
    {
      if(parseInt(data.intAwayScore) < parseInt(data.intHomeScore))
      {
        return true;
      }
    }

    return false;
  }
}


