import { Component, OnInit, Input } from '@angular/core';

import { User } from './../../../user/user.model';

@Component({
  selector: 'app-guard-duty-step-users',
  templateUrl: './guard-duty-step-users.component.html',
  styleUrls: ['./guard-duty-step-users.component.css']
})
export class GuardDutyStepUsersComponent implements OnInit {
  @Input() firstUser: User;
  @Input() secondUser: User;
  
  constructor() { }

  ngOnInit() {
  }

}
