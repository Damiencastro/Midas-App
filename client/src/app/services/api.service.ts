import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { count } from 'console';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { UserModel } from '../basicFunctionality/account-old/account.model';
import { ChartModel } from '../basicFunctionality/chart-old/chart.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private userKey = 'user';
  private userModelObj: UserModel = new UserModel();
  logged: boolean = false;
  private loginModelObj: UserModel = new UserModel();
  private loggedoutModelObj: UserModel = new UserModel();
  private selectedObj: UserModel = new UserModel();
  private profileModelObj: UserModel = new UserModel();
  private accountProfileModelObj: UserModel = new UserModel();


  constructor(private http: HttpClient, private router: Router) { }


// Puts logged account in local storage
  login(username: any, password: any) {
    this.http.get<any>("http://localhost:3000/posts/").subscribe(res => {
      const user = res.find((a: any) => {
        return a.username === username && a.password === password
      });
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        // this.loginModelObj = user;
        const temp = localStorage.getItem('user');
        if (temp != null) {
          const log = JSON.parse(temp);
          this.loginModelObj = log;
          alert(this.loginModelObj.firstname + " You are logged in!");
          this.router.navigate(['']);
          this.logged = true;
        }
        else {
          alert("Password or Username incorrect");
        }



      }
      else {
        alert("Password or Username incorrect");
      }
    });
  }

  // Puts Profile on local storage to show in profile page
  profile(id: any, username: any) {
    this.http.get<any>("http://localhost:3000/posts/").subscribe(res => {
      const user = res.find((a: any) => {
        return a.id === id && a.username === username
      });
      if (user) {
        localStorage.setItem('profile', JSON.stringify(user));
        const temp = localStorage.getItem('profile');
        if (temp != null) {
          const log = JSON.parse(temp);
          this.profileModelObj = log;
          //alert(this.profileModelObj.firstname + "'s profile has been generated");
        }
        else {
          alert("User Profile does not exist");
        }
      }
      else {
        alert("User Profile does not exist");
      }
    });
  }




  userDetail(): UserModel {
    return this.loginModelObj;
  }

  getRole(): number {
    if (this.loggedoutModelObj.role == "Admin") {
      return 1;
    }
    else if (this.loggedoutModelObj.role == "Manager") {
      return 2;
    }
    else if (this.loggedoutModelObj.role == "Accountant") {
      return 3;
    }
    else {
      return 4;
    }
  }



  isLoggedIn = (): boolean => {
    return this.logged;
  };

  logout = (): void => {
    this.logged = false;
    this.loginModelObj = this.loggedoutModelObj;
  };

  postUser(data: any) {

    return this.http.post<any>("http://localhost:3000/posts/", data).pipe(map((res: any) => { return res; }))

  }

  getUser() {
    return this.http.get<any>("http://localhost:3000/posts/").pipe(map((res: any) => { return res; }))
  }

  getUserIdV2(id: number) {
    return this.http.get<UserModel>("http://localhost:3000/posts/" + id).pipe(map((res: UserModel) => { return res; }))
  }


  getUserById(id: number) {
    this.http.get<any>("http://localhost:3000/posts/").subscribe(res => {
      const user = res.find((a: any) => {
        return a.id === id
      });
      if (user) {
        this.selectedObj = user;
      }
      return this.selectedObj;
    });
  }



  updateUser(data: any, id: number) {
    return this.http.put<any>("http://localhost:3000/posts/" + id, data).pipe(map((res: any) => { return res; }))
  }

  deleteUser(id: number) {
    return this.http.delete<any>("http://localhost:3000/posts/" + id).pipe(map((res: any) => { return res; }))
  }

  // getById(id: number) {
  //   return this.http.get<any>(`http://localhost:3000/posts/${id}`);
  // }
  update(data: any, id: number) {
    return this.http.put<any>(`http://localhost:3000/posts/${id}`, data);
  }












}
