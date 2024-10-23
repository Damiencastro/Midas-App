import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { count } from 'console';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { ChartModel } from '../basicFunctionality/chart/chart.model';
import { UserModel } from '../basicFunctionality/account/account.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private userModelObj: UserModel = new UserModel();
  logged: boolean = false;
  private chartModelObj: ChartModel = new ChartModel();
  private accountProfileModelObj: ChartModel = new ChartModel();


  constructor(private http: HttpClient, private router: Router, private api: ApiService) { }

  accountProfile(id: any, chartName: any) {
    this.http.get<any>("http://localhost:3000/charts/").subscribe(res => {
      const user = res.find((a: any) => {
        return a.id === id && a.chartName === chartName
      });
      if (user) {
        localStorage.setItem('a-profile', JSON.stringify(user));
        const temp = localStorage.getItem('a-profile');
        if (temp != null) {
          const log = JSON.parse(temp);
          this.accountProfileModelObj = log;
          //alert(this.accountProfileModelObj.chartName + "'s profile has been generated");
        }
        else {
          alert("Account does not exist");
          return;
        }
      }
      else {
        alert("Account does not exist");
        return;
      }
    });
  }


  postChart(data: any) {

    return this.http.post<any>("http://localhost:3000/charts/", data).pipe(map((res: any) => { return res; }))

  }

  getChart() {
    return this.http.get<any>("http://localhost:3000/charts/").pipe(map((res: any) => { return res; }))
  }

  updateChart(data: any, id: any) {
    return this.http.put<any>("http://localhost:3000/charts/" + id, data).pipe(map((res: any) => { return res; }))
  }

  deleteChart(id: any) {
    return this.http.delete<any>("http://localhost:3000/charts/" + id).pipe(map((res: any) => { return res; }))
  }

  // getById(id: number) {
  //   return this.http.get<any>(`http://localhost:3000/posts/${id}`);
  // }
  update(data: any, id: any) {
    return this.http.put<any>(`http://localhost:3000/charts/${id}`, data);
  }












}
