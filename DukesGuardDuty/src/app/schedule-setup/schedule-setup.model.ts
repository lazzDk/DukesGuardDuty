import { User } from './../user/user.model';

export interface ScheduleSetup {
    id?: string;
    startDate: number;
    users: User[];
}

