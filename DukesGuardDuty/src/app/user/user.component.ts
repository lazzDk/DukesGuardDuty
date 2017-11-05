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

  userName: string;
  userII: string;

  constructor(private db: AngularFirestore){
    this.userCollection = db.collection<User>('Users');
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

  addUser(){
    this.userCollection.add({name: this.userName, initials: this.userII});
    this.userName = '';
    this.userII =  '';
  }

  deleteUser(user:User){
    this.userCollection.doc(user.id).delete();;
  }

}
