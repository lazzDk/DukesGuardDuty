import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { AccessRequest } from './access-request.model';
import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  accessRequestCollection: AngularFirestoreCollection<AccessRequest>;
  accessRequests: Observable<AccessRequest[]>;

  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.accessRequestCollection = db.collection<AccessRequest>('AccessRequests');
     this.accessRequests = this.accessRequestCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as AccessRequest;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
   }

  ngOnInit() {
  }

  approve(request: AccessRequest){
    if(confirm("Er du sikker på, at du vil godkende "+request.displayName)) {
      request.isApproved = true;
      request.approvedById = this.authService.uid;
      this.accessRequestCollection.doc(request.id).set(request); 
    }
  }

  delete(request: AccessRequest){
    if(confirm("Er du sikker på, at du vil slette denne request fra "+request.displayName)) {
      this.accessRequestCollection.doc(request.id).delete(); 
    }
  }

}
