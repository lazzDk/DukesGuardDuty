import { Injectable } from '@angular/core';

import { AngularFireAuth  } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  displayName: string;
  isAuthed: boolean = false;
  private userIds = ["h3sxrjPQ7BSST85rXc7PHbm6J3z1"];

  constructor(private firebaseAuth: AngularFireAuth) { 
    this.user = firebaseAuth.authState;
    firebaseAuth.authState.subscribe(data => {
       this.displayName = data == null ? '' : data.displayName;
       this.isAuthed = data != null && this.userIds.includes(data.uid);
     });
  }


  login(){
    this.firebaseAuth
      .auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(value => {
        console.log("You have logged in");
      });
  }

  logout(){
    this.firebaseAuth
      .auth
      .signOut();
  }

  getUser(){
    console.log(this.firebaseAuth.auth.currentUser);
  }

}
