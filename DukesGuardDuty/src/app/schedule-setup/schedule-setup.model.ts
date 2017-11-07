import { User } from './../user/user.model';

export interface ScheduleSetup {
    startDate: number;
    users: User[];
}

