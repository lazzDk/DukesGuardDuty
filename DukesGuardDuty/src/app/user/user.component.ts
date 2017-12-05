import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './../auth/auth.service';
import { User } from './user.model';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: Observable<User[]>;

  constructor(
    public authService: AuthService,  
    private userService: UserService){
  }

  ngOnInit() {
    this.users = this.userService.getMappedUsers();
  }
 
  deleteUser(user:User){
    if(confirm("Er du sikker på, at du vil slette "+user.name)) {
      this.userService.deleteUser(user); 
    }
  }

}
