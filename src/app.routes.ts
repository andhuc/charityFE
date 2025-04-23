import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Campaign } from './app/pages/landing/campaign';
import { Donate } from './app/pages/landing/donate';

export const appRoutes: Routes = [
    { path: '', component: Landing },
    { path: '', loadChildren: () => import('./app/pages/auth/auth.routes') },
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: '', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'campaign', component: Campaign },
    { path: 'donate', component: Donate },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
