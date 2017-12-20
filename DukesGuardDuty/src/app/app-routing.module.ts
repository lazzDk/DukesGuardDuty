import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './auth-guard.service';
import { AdminComponent } from './admin/admin.component';
import { GuardDutyStepComponent } from './guard-duty/guard-duty-step/guard-duty-step.component';
import { GuardDutyViewerComponent } from './guard-duty/guard-duty-viewer/guard-duty-viewer.component';
import { GuardDutySelectorComponent } from './guard-duty/guard-duty-selector/guard-duty-selector.component';
import { GuardDutySwitchComponent } from './guard-duty/guard-duty-switch/guard-duty-switch.component';
import { ScheduleSetupComponent } from './schedule-setup/schedule-setup.component';
import { UserComponent } from './user/user.component';

const appRoutes:Routes =  [
    {
        path: 'users', 
        component: UserComponent
    },
    {
        path: 'guardDuty',
        component: GuardDutyViewerComponent
    },
    {
        path: 'guardDutyselector',
        component: GuardDutySelectorComponent
    },
    {
        path: 'guardDutyswitch',
        component: GuardDutySwitchComponent
    },
    {
        path: 'schedulesetup',
        component: ScheduleSetupComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/guardDuty'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
    providers: [AuthGuardService]
})

export class AppRoutingModule {

}