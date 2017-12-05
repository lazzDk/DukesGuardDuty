import { Injectable } from '@angular/core';

import  { Router } from '@angular/router';
import { AngularFireAuth  } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { AccessRequest } from './../admin/access-request.model';
import { AccessConfirmation } from './../admin/access-confirmation.model';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  displayName: string;
  isAuthed: boolean = false;
  uid:string = '';

  private accessRequestCollection: AngularFirestoreCollection<AccessRequest>;
  private accessRequests: AccessRequest[] = [];

  private accessConfirmationCollection: AngularFirestoreCollection<AccessConfirmation>;
  private accessConfirmations: AccessConfirmation[] = [];

  private accessRequestsFetched: boolean = false;
  private accessConfirmationsFetched: boolean = false;
 
  constructor(private firebaseAuth: AngularFireAuth, private db: AngularFirestore, private router: Router) { 
    this.user = firebaseAuth.authState;
   
    this.accessRequestCollection = this.db.collection<AccessRequest>('AccessRequests');
    this.accessConfirmationCollection = db.collection<AccessConfirmation>('AccessConfirmations');
    
    this.accessRequestCollection.valueChanges().subscribe(data => {
      this.accessRequestsFetched = true;
      this.accessRequests = data;
      this.setAuthStatus();
    });

    this.accessConfirmationCollection.valueChanges().subscribe(data => {
      this.accessConfirmationsFetched = true;
      this.accessConfirmations = data;
      this.setAuthStatus();
    });

    firebaseAuth.authState.subscribe(data => {
      this.displayName = data == null ? '' : data.displayName;
      this.uid = data == null ? '' : data.uid;
      this.setAuthStatus();
     });
  }

  hasAccessRequest(){
    let item = this.accessRequests.find(accessRequest => accessRequest.userId == this.uid);
    return item != null;
  }

  handleAccessRequest(){
    if(!this.hasAccessRequest()){
      this.accessRequestCollection.add({displayName: this.displayName, userId: this.uid}) ;
    }
  }

  hasApprovedConfirmation(){
    let item = this.accessConfirmations.find(accessConfirmation => accessConfirmation.userId == this.uid);
    return item != null;
  }

  checkAccess(): boolean{
    if(this.uid == '' || !this.accessRequestsFetched || !this.accessConfirmationsFetched) { 
      return false;
    }
    if(this.hasApprovedConfirmation()) {
      return true;
    }
    this.handleAccessRequest();
    return false;
  }

  setAuthStatus(){
    this.isAuthed = this.checkAccess();
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
      this.router.navigate(['/guardDuty']);
  }

  getUser(){
    console.log(this.firebaseAuth.auth.currentUser);
  }

}
