import { User } from './../../user/user.model';

export interface GuardDutySwitch{
    scheduleSetupId: string;
    
    fromWeek: number;
    fromUser: User;

    toWeek: number;
    toUser: User;
}