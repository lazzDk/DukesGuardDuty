import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { ScheduleSetup } from './schedule-setup.model';

@Injectable()
export class ScheduleSetupService {
  scheduleSetupCollection: AngularFirestoreCollection<ScheduleSetup>;
  scheduleSetups: Observable<ScheduleSetup[]>;

  constructor(private db: AngularFirestore) {
    this.scheduleSetupCollection = db.collection<ScheduleSetup>('ScheduleSetup', ref => ref.where('startDate', '<=', Date.now()).orderBy('startDate'));
    this.scheduleSetups = this.scheduleSetupCollection.valueChanges();
   }
 
   getScheduleSetups(): Observable<ScheduleSetup[]> {
     return this.scheduleSetups;
   }

   addScheduleSetup(scheduleSetup: ScheduleSetup){
    this.scheduleSetupCollection.add(scheduleSetup);
   }

}
