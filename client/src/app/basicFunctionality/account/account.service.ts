// New Method

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Users } from "./account";

@Injectable({
  providedIn: 'root'
})

export class AccountService{
  constructor(private _httpClient:HttpClient){}

    getAllUsers(){
      return this._httpClient.get<Users[]>("http://localhost:3000/posts");
    }

    create(data: Users){
      return this._httpClient.post("http://localhost:3000/posts", data);
    }

    update(data: Users, id: number){
      return this._httpClient.put<Users>(`http://localhost:3000/posts/${id}`, data);
    }

    delete(data: Users, id: number){
      return this._httpClient.delete<Users>(`http://localhost:3000/posts/${id}`);
    }

    getById(id: number){
      return this._httpClient.get<Users>(`http://localhost:3000/posts/${id}`);
    }




}
