import { User } from './../../user/user.model';

export interface GuardDutySwitch{
    id?: string;
    scheduleSetupId: string;
    
    fromWeek: number;
    fromUser: User;

    toWeek: number;
    toUser: User;
}