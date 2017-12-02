import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { GuardDutySwitch } from './guard-duty-switch.model';
import { User } from './../../user/user.model';

@Injectable()
export class GuardDutySwitchService {
  guardDutySwitchCollection: AngularFirestoreCollection<GuardDutySwitch>;
  guardDutySwitches: Observable<GuardDutySwitch[]>;

  constructor(private db: AngularFirestore) {
    this.guardDutySwitchCollection = db.collection<GuardDutySwitch>('GuardDutySwitch');
    this.guardDutySwitches = this.guardDutySwitchCollection.valueChanges();
  }

  getGuardDutySwitches(): Observable<GuardDutySwitch[]> {
    return this.guardDutySwitches;
  }


  addGuardDutySwitch(fromWeek:number, fromUser: User, toWeek:number, toUser: User, scheduleSetupId: string){
    this.guardDutySwitchCollection.add({fromWeek: fromWeek, fromUser: fromUser, toWeek: toWeek, toUser: toUser, scheduleSetupId: scheduleSetupId});
   }
}
