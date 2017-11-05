import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user/user.component';
import { GuardDutyComponent } from './guard-duty/guard-duty.component';

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