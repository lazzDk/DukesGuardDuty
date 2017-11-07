import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GuardDutyComponent } from './guard-duty/guard-duty.component';
import { ScheduleSetupComponent } from './schedule-setup/schedule-setup.component';
import { UserComponent } from './user/user.component';

const appRoutes:Routes =  [
    {
        path: 'users', 
        component: UserComponent
    },
    {
        path: 'guardDuty',
        component: GuardDutyComponent
    },
    {
        path: 'schedulesetup',
        component: ScheduleSetupComponent
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/guardDuty'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}