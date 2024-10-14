import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';

import { ApiService } from '../../shared/api.service';
import { UserModel } from '../account/account.model';
import { Users } from '../account/account';

import { ChartService } from '../../shared/chart.service';
import { ChartModel } from './chart.model';

import { AccountService } from '../account/account.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { LoginComponent } from '../../pages/login/login.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit{



    formValue !: FormGroup;
    userModelObj : UserModel = new UserModel();
    currentUserObj : UserModel = new UserModel();
    userData !: any;
    chartUserData !: any;

    chartModelObj : ChartModel = new ChartModel();
    currentChartObj : ChartModel = new ChartModel();
    chartData !: any;

    public userDetail: UserModel = new UserModel();



    showAdd: boolean = false;
    showEdit:boolean = false;
    passwordHide: boolean = true;
    confirmPasswordHide: boolean = true;



    constructor(private formbuilder: FormBuilder, private api : ApiService, private chart: ChartService, private AccountService: AccountService, private router: Router){

      this.formValue = new FormGroup({
        // id: new FormControl("",),
        chartName: new FormControl("",),
        normalSide: new FormControl("",),
        category: new FormControl("",),
        subCategory: new FormControl("",),
        initialBalance: new FormControl("", ),
        debit: new FormControl("",),
        credit: new FormControl("",),
        balance: new FormControl("",),
        created: new FormControl("",),
        userId: new FormControl("",),
        order: new FormControl("",),
        statement: new FormControl("",),
        comment: new FormControl("",),
      },)
    }


    createProfile(id: any, chartName: any){
      this.chart.accountProfile(id, chartName);
      this.router.navigate(['/account-profile'])
    }


    ngOnInit(): void {
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('user') != null) {
          const temp = localStorage.getItem('user');
          if (temp != null) {
            this.userDetail = JSON.parse(temp);
          }
        }
      }

        this.getAllCharts();
        this.getAllUsers()
    }

    clickAddChart(){
      this.formValue.reset();
      this.showAdd = true;
      this.showEdit = false;
    }

    postChartDetails(){

      this.chartModelObj.chartName = this.formValue.value.chartName;
      this.chartModelObj.normalSide = this.formValue.value.normalSide;
      this.chartModelObj.category = this.formValue.value.category;
      this.chartModelObj.subCategory = this.formValue.value.subCategory;
      this.chartModelObj.initialBalance = this.formValue.value.initialBalance;
      this.chartModelObj.debit = this.formValue.value.debit;
      this.chartModelObj.credit = this.formValue.value.credit;
      this.chartModelObj.balance = this.formValue.value.balance;
      this.chartModelObj.created = this.formValue.value.created;
      this.chartModelObj.userId = this.formValue.value.userId;
      this.chartModelObj.order = this.formValue.value.order;
      this.chartModelObj.statement = this.formValue.value.statement;
      this.chartModelObj.comment = this.formValue.value.comment;




      this.chart.postChart(this.chartModelObj).subscribe(res=>{
        console.log(res);
        alert("Account has been successfully added!")
        let ref = document.getElementById('cancel');
        ref?.click();
        this.formValue.reset();
        this.getAllCharts();
        this.getAllUsers()
      });

    }

    getAllUsers(){
        this.api.getUser().subscribe(res=>{
          this.userData = res;
        })
    }

    getAllCharts(){
      this.chart.getChart().subscribe(res=>{
        this.chartData = res;
      })
    }


    deleteChart(row : any){
      this.chart.deleteChart(row.id).subscribe(res=>{
        alert("Chart Has Been Deleted.")
        this.getAllCharts();
      })
    }



    onEdit(row: any){

      this.showEdit = true;
      this.showAdd = false;

      this.chartModelObj.id = row.id;
      this.formValue.controls['chartName'].setValue(row.chartName);
      this.formValue.controls['normalSide'].setValue(row.normalSide);
      this.formValue.controls['category'].setValue(row.category);
      this.formValue.controls['subCategory'].setValue(row.subCategory);
      this.formValue.controls['initialBalance'].setValue(row.initialBalance);
      this.formValue.controls['debit'].setValue(row.debit);
      this.formValue.controls['credit'].setValue(row.credit);
      this.formValue.controls['balance'].setValue(row.balance);
      this.formValue.controls['created'].setValue(row.created);
      this.formValue.controls['userId'].setValue(row.userId);
      this.formValue.controls['order'].setValue(row.order);
      this.formValue.controls['statement'].setValue(row.statement);
      this.formValue.controls['comment'].setValue(row.comment);
    }

    updateChartDetails(){
      this.chartModelObj.chartName = this.formValue.value.chartName;
      this.chartModelObj.normalSide = this.formValue.value.normalSide;
      this.chartModelObj.category = this.formValue.value.category;
      this.chartModelObj.subCategory = this.formValue.value.subCategory;
      this.chartModelObj.initialBalance = this.formValue.value.initialBalance;
      this.chartModelObj.debit = this.formValue.value.debit;
      this.chartModelObj.credit = this.formValue.value.credit;
      this.chartModelObj.balance = this.formValue.value.balance;
      this.chartModelObj.created = this.formValue.value.created;
      this.chartModelObj.userId = this.formValue.value.userId;
      this.chartModelObj.order = this.formValue.value.order;
      this.chartModelObj.statement = this.formValue.value.statement;
      this.chartModelObj.comment = this.formValue.value.comment;


      this.chart.updateChart(this.chartModelObj, this.chartModelObj.id).subscribe(res=>{
        alert("Updated Sucessfully!");
        let ref = document.getElementById('cancel')
        ref?.click();
        this.formValue.reset();
        this.getAllCharts();
        this.getAllUsers()
      })

    }





  }

