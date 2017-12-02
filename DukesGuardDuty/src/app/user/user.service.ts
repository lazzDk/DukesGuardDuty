import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { User } from './user.model';


@Injectable()
export class UserService {
  userCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  constructor(private db: AngularFirestore) {
    this.userCollection = db.collection<User>('Users', ref => ref.orderBy('name'));
    this.users = this.userCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as User;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
   }

   getMappedUsers(): Observable<User[]> {
     return this.users;
   }

   getUsers(){
     return this.userCollection.valueChanges();
   }


   addUser(userName: string, initials: string){
    this.userCollection.add({name: userName, initials: initials});
   }

   deleteUser(user:User): void {
      this.userCollection.doc(user.id).delete(); 
   }

}
