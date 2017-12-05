import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { ScheduleSetup } from './schedule-setup.model';

@Injectable()
export class ScheduleSetupService {
  private scheduleSetupCollection: AngularFirestoreCollection<ScheduleSetup>;
  private scheduleSetups: Observable<ScheduleSetup[]>;

  constructor(private db: AngularFirestore) {
    this.scheduleSetupCollection = db.collection<ScheduleSetup>('ScheduleSetup', ref => ref.where('startDate', '<=', Date.now()).orderBy('startDate'));
    this.scheduleSetups = this.scheduleSetupCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as ScheduleSetup;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
   }

   getMappedScheduleSetup(): Observable<ScheduleSetup[]>{
    return this.scheduleSetups;
   }
 
   getScheduleSetups(): Observable<ScheduleSetup[]> {
     return this.scheduleSetupCollection.valueChanges();
   }

   addScheduleSetup(scheduleSetup: ScheduleSetup){
    this.scheduleSetupCollection.add(scheduleSetup);
   }

}
