import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserLinkingService {

  constructor() { }

  link(userService: UserService) {
    throw new Error('Method not implemented.');
  }
}
