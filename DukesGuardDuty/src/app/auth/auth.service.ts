import { Injectable } from '@angular/core';

import { AngularFireAuth  } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { AccessRequest } from './../admin/access-request.model';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  displayName: string;
  isAuthed: boolean = false;
  uid:string = '';

  accessRequestCollection: AngularFirestoreCollection<AccessRequest>;
  accessRequests: AccessRequest[] = [];

  hasFetchedAccess: boolean = false;
 
  constructor(private firebaseAuth: AngularFireAuth, private db: AngularFirestore) { 
    this.user = firebaseAuth.authState;
    
    this.accessRequestCollection = db.collection<AccessRequest>('AccessRequests');
    this.accessRequestCollection.valueChanges().subscribe(data => {
      this.accessRequests = data;
      this.hasFetchedAccess = true;
      this.setAuthStatus();
    })
    firebaseAuth.authState.subscribe(data => {
      this.displayName = data == null ? '' : data.displayName;
      this.uid = data == null ? '' : data.uid;
      this.setAuthStatus();
      
     });
  }

  checkAccess(): boolean{
    if(this.uid == '') { 
      return false;
    }
    if(!this.hasAccessRequest() && this.hasFetchedAccess){
      this.accessRequestCollection.add({displayName: this.displayName, isApproved:false, userId: this.uid}) ;
      return false;
    }
    return this.isApprovedAccess();
  }

  setAuthStatus(){
    this.isAuthed = this.checkAccess();
  }

  hasAccessRequest(){
    let item = this.accessRequests.find(accessRequest => accessRequest.userId == this.uid);
    return item != null;
  }

  isApprovedAccess(){
    let item = this.accessRequests.find(accessRequest => accessRequest.userId == this.uid && accessRequest.isApproved == true);
    return item != null;
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
