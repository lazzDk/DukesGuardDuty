import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { GuardDutySwitch } from './guard-duty-switch.model';
import { ScheduleSetup } from './../../schedule-setup/schedule-setup.model';
import { User } from './../../user/user.model';

@Injectable()
export class GuardDutySwitchService {
  private guardDutySwitchCollection: AngularFirestoreCollection<GuardDutySwitch>;
  private guardDutySwitches: Observable<GuardDutySwitch[]>;

  constructor(private db: AngularFirestore) {
    this.guardDutySwitchCollection = db.collection<GuardDutySwitch>('GuardDutySwitch', ref => ref.orderBy('fromWeek'));
    this.guardDutySwitches = this.guardDutySwitchCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as GuardDutySwitch;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  getGuardDutySwitches(): Observable<GuardDutySwitch[]> {
    return this.guardDutySwitches;
  }


  addGuardDutySwitch(fromWeek:number, fromUser: User, toWeek:number, toUser: User, scheduleSetup: ScheduleSetup){
    this.guardDutySwitchCollection.add({fromWeek: fromWeek, fromUser: fromUser, toWeek: toWeek, toUser: toUser, scheduleSetupId: scheduleSetup.id});
  }

  deleteGuardDutySwitch(guardDutySwitch: GuardDutySwitch){
    this.guardDutySwitchCollection.doc(guardDutySwitch.id).delete(); 
  }
  
   
}
