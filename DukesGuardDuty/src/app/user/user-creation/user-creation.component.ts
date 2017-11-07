import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { User } from './../user.model';

@Component({
  selector: 'app-user-creation',
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.css']
})
export class UserCreationComponent implements OnInit {
  userCollection: AngularFirestoreCollection<User>;
  userName: string;
  userInitials: string;
  lastIndex :number = 0;

  constructor(private db: AngularFirestore){
    this.userCollection = db.collection<User>('Users', ref => ref.orderBy('index'));
    this.userCollection.valueChanges().subscribe(users => {
      this.lastIndex = users[users.length-1].index +  1;
    })
  }

  ngOnInit() {
  }

  addUser(){
    this.userCollection.add({name: this.userName, initials: this.userInitials, index: this.lastIndex});
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
