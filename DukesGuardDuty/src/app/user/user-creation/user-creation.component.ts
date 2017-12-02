import { Component, OnInit } from '@angular/core';

import { User } from './../user.model';
import { UserService } from './../user.service';

@Component({
  selector: 'app-user-creation',
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.css']
})
export class UserCreationComponent implements OnInit {
  userName: string;
  userInitials: string;
  lastIndex :number = 0;

  constructor(private userService: UserService){  }

  ngOnInit() {
  }

  addUser(){
    this.userService.addUser(this.userName, this.userInitials);
    this.userName = '';
    this.userInitials =  '';
  }

  onUserNameChanges(){
    if(this.userName.length <= 0)
        return;
    var lastSpaceIndex = this.userName.indexOf(' ');
    this.userInitials = this.userName.charAt(0) + this.userName.charAt(lastSpaceIndex + 1);
  }

}
