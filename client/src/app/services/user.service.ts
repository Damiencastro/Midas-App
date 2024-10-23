import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { UserModel } from '../models/user.model';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user: UserModel = new UserModel();


  constructor() { }

  login(auth: Auth, email: string, password: string) {
    signInWithEmailAndPassword(auth, email + '@midas-app.com', password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(userCredential);
        })
        .catch((error) => {
          console.error(error);
        })
    return this;
  }

  logout(auth: Auth) {
    auth.signOut();
  }

  create(auth: Auth) {
    createUserWithEmailAndPassword(auth, this.user.username, this.user.password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        console.error(error);
      })

    
  }
}
