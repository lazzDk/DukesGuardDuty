import { Injectable } from '@angular/core'; 

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { AccessRequest } from './access-request.model';
import { AccessConfirmation } from './access-confirmation.model';

@Injectable()
export class AccessService {
  private accessRequestCollection: AngularFirestoreCollection<AccessRequest>;
  private accessRequests: Observable<AccessRequest[]>;

  private accessConfirmationCollection: AngularFirestoreCollection<AccessConfirmation>;
  private accessConfirmations: Observable<AccessConfirmation[]>;
  
  constructor(private db: AngularFirestore) {
    this.accessRequestCollection = db.collection<AccessRequest>('AccessRequests');
    this.accessRequests = this.accessRequestCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as AccessRequest;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });

    this.accessConfirmationCollection = db.collection<AccessConfirmation>('AccessConfirmations');
    this.accessConfirmations = this.accessConfirmationCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as AccessConfirmation;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  getAccessRequests():Observable<AccessRequest[]>{
    return this.accessRequests;
  }
   
  deleteAccessRequest(request: AccessRequest){
    this.accessRequestCollection.doc(request.id).delete();   
  }

  getAccessConfirmations():Observable<AccessConfirmation[]>{
    return this.accessConfirmations;
  }
  
  addAccessConfirmation(displayName: string, userId: string, approvedById: string): void{
    this.accessConfirmationCollection.add({displayName: displayName, userId:userId, approvedById: approvedById});
  } 

  deleteAccessConfirmation(confirmation: AccessConfirmation){
    this.accessConfirmationCollection.doc(confirmation.id).delete(); 
  }
}
