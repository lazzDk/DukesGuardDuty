import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { User } from './user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  constructor(private db: AngularFirestore){
    this.userCollection = db.collection<User>('Users', ref => ref.orderBy('index'));
    this.users = this.userCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as User;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  ngOnInit() {
  }

  changeUp(user:User){

  }

  changeDown(user:User){
    
  }

  deleteUser(user:User){
    if(confirm("Er du sikker på, at du vil slette "+user.name)) {
      this.userCollection.doc(user.id).delete(); 
    }
  }

}
