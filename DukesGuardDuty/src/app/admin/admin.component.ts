import { Component, OnInit } from '@angular/core';
 
import { Observable } from 'rxjs/Observable';

import { AccessRequest } from './access-request.model';
import { AccessConfirmation } from './access-confirmation.model';
import { AuthService } from './../auth/auth.service';
import { AccessService } from './access.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  accessRequests: Observable<AccessRequest[]>;
  accessConfirmations: Observable<AccessConfirmation[]>;

  constructor(private accessService: AccessService, public authService: AuthService) {
    this.accessRequests = this.accessService.getAccessRequests();
    this.accessConfirmations = this.accessService.getAccessConfirmations();
   }

  ngOnInit() {
  }

  approveRequest(request: AccessRequest){
    if(confirm("Er du sikker på, at du vil godkende "+request.displayName)) {
      this.accessService.addAccessConfirmation(request.displayName,request.userId, this.authService.uid);
      this.accessService.deleteAccessRequest(request);
    }
  }

  deleteRequest(request: AccessRequest){
    if(confirm("Er du sikker på, at du vil slette denne request fra "+request.displayName)) {
      this.accessService.deleteAccessRequest(request);
    }
  }  
  
  removeAccess(confirmation: AccessConfirmation){
    if(confirm("Er du sikker på, at du vil fjerne adgang fra "+confirmation.displayName)) {
      this.accessService.deleteAccessConfirmation(confirmation); 
    }
  }

}
