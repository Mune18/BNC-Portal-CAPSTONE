import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './_auth/auth-layout.component';
import { SignInFormComponent } from './_auth/forms/sign-in-form.component';
import { SignUpInformationFormComponent } from './_auth/forms/sign-up-information-form.component';
import { DashboardComponent } from './_root/pages/dashboard.component';
import { RootLayoutAdminComponent } from './_root/root-layout-admin.component';
import { RootLayoutUserComponent } from './_root/root-layout-user.component';
import { HomeComponent } from './_root/userPages/home.component';
import { ProfileComponent } from './_root/userPages/profile.component';
import { ResidentsComponent } from './_root/pages/residents.component';
import { AnnouncementComponent } from './_root/pages/announcement.component';
import { ReportsComponent } from './_root/pages/reports.component';
import { ResidentUpdateRequestsComponent } from './_root/pages/resident-update-requests.component';
import { ComplaintsComponent } from './_root/userPages/complaints.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { ResidentGuard } from './shared/guards/resident.guard';
import { EmailConfigComponent } from './_root/pages/email-config.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
            {path: 'sign-in', component: SignInFormComponent},
        ]
    },
    {
        path: 'sign-up',
        component: SignUpInformationFormComponent
    },
    {
        path: 'admin',
        component: RootLayoutAdminComponent,
        canActivate: [AdminGuard],
        children: [
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {path: 'dashboard', component: DashboardComponent},
            {path: 'residents', component: ResidentsComponent},
            {path: 'update-requests', component: ResidentUpdateRequestsComponent},
            {path: 'announcements', component: AnnouncementComponent},
            {path: 'reports', component: ReportsComponent},
        ]
    },
    {
        path: 'user',
        component: RootLayoutUserComponent,
        canActivate: [ResidentGuard],
        children: [
            {path: '', redirectTo: 'home', pathMatch: 'full'},
            {path: 'profile', component: ProfileComponent},
            {path: 'home', component: HomeComponent},
            {path: 'complaints', component: ComplaintsComponent},
        ]
    },
    // Add a catch-all route that redirects to sign-in
    {
        path: '**',
        redirectTo: 'sign-in'
    }
];
