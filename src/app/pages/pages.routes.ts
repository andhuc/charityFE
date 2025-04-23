import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { UserPage } from './admin/user';
import { DonationPage } from './admin/donation';

export default [
    { path: 'crud', component: Crud },
    { path: 'user', component: UserPage },
    { path: 'donation', component: DonationPage },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
