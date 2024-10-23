import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from '../login-old/login.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { UserModel } from '../account-old/account.model';
import { ChartModel } from '../chart-old/chart.model';
import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrl: './account-profile.component.scss'
})
export class AccountProfileComponent implements OnInit {

  public profileDetail: UserModel = new UserModel();
  public reset: UserModel = new UserModel();

  public chartDetail: ChartModel = new ChartModel();


  constructor(private api: ApiService, private router: Router, private chart: ChartService,) { }

  ngOnInit(): void {

    if (typeof window !== 'undefined') {
      if (localStorage.getItem('a-profile') != null) {
        const temp = localStorage.getItem('a-profile');
        if (temp != null) {
          this.chartDetail = JSON.parse(temp);
        }
      }
    }
  }


}

