import { Component, inject, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatchDetailModel } from '../../models/matchdetails.model'
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { TeamModel } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-infomatch',
  templateUrl: './infomatch.component.html',
  styleUrls: ['./infomatch.component.css']
})
export class InfomatchComponent implements OnInit {

  // http = inject(HttpClient);

  infoMatch!: any;

  ngOnInit(): void { 
  }
}
