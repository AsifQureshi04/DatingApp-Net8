import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { MemberDetailComponent } from './components/members/member-detail/member-detail.component';
import { ListComponent } from './components/list/list.component';
import { MessagesComponent } from './components/messages/messages.component';
import { authGuard } from './guard/auth.guard';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberEditComponent } from './components/members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './guard/prevent-unsaved-changes.guard';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {
        path:'',
        runGuardsAndResolvers:'always',
        canActivate:[authGuard],
        children:[
            {path:'members',component:MemberListComponent},
            {path:'members/:username',component:MemberDetailComponent},
            {path:'member/:edit',component:MemberEditComponent, canDeactivate:[preventUnsavedChangesGuard]},
            {path:'lists',component:ListComponent},
            {path:'messages',component:MessagesComponent},
        ]
    }, 
    {path: 'errors', component: TestErrorsComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: 'server-error', component: ServerErrorComponent}, 
    {path:'**',component:HomeComponent,pathMatch:'full'}
];
