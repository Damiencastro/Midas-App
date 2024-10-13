import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { count } from 'console';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { UserModel } from '../pages/account/account.model';

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

  constructor(private http: HttpClient, private router: Router) { }



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
    else {
      return 3;
    }
  }

  updateUserPassword(id: any, password: any){
    const temp = this.getUserById(id);
    if(temp!=null){
        this.selectedObj = temp;
    }
    else{
      return;
    }
    this.selectedObj.password = password;
    this.updateUser(this.selectedObj, this.selectedObj.id).subscribe(res=>{
      alert("Password Updated Sucessfully!");
    })
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

  // getUsers(){
  //   return this.http.get<any[]>("http://localhost:3000/posts/").pipe(map((res: any[])=>{return res;}))
  // }

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
