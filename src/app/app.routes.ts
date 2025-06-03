import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './_auth/auth-layout.component';
import { SignInFormComponent } from './_auth/forms/sign-in-form.component';
import { SignUpFormComponent } from './_auth/forms/sign-up-form.component';
import { SignUpInformationFormComponent } from './_auth/forms/sign-up-information-form.component';
import { DashboardComponent } from './_root/pages/dashboard.component';
import { RootLayoutAdminComponent } from './_root/root-layout-admin.component';
import { RootLayoutUserComponent } from './_root/root-layout-user.component';
import { HomeComponent } from './_root/userPages/home.component';
import { ProfileComponent } from './_root/userPages/profile.component';
import { ResidentsComponent } from './_root/pages/residents.component';
import { DocuComponent } from './_root/pages/docu.component';
import { AnnouncementComponent } from './_root/pages/announcement.component';
import { ReportsComponent } from './_root/pages/reports.component';
import { DocumentsComponent } from './_root/userPages/documents.component';
import { ComplaintsComponent } from './_root/userPages/complaints.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
            {path: 'sign-in', component: SignInFormComponent},
            // {path: 'sign-up', component: SignUpFormComponent},
        ]
    },
    {
        path: 'sign-up-information',
        component: SignUpInformationFormComponent
    },
    {
        path: 'admin',
        component: RootLayoutAdminComponent,
        children: [
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {path: 'dashboard', component: DashboardComponent},
            {path: 'residents', component: ResidentsComponent},
            // {path: 'documents', component: DocuComponent},
            {path: 'announcements', component: AnnouncementComponent},
            {path: 'reports', component: ReportsComponent},
        ]
    },
    {
        path: 'user',
        component: RootLayoutUserComponent,
        children: [
            {path: '', redirectTo: 'home', pathMatch: 'full'},
            {path: 'profile', component: ProfileComponent},
            {path: 'home', component: HomeComponent},
            // {path: 'request', component: DocumentsComponent},
            {path: 'complaints', component: ComplaintsComponent},
        ]
    },
];
