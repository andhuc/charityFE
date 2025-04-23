import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { UserPage } from './admin/user';
import { DonationPage } from './admin/donation';
import { UserDonationPage } from './admin/user-donation';

export default [
    { path: 'crud', component: Crud },
    { path: 'user', component: UserPage },
    { path: 'donation', component: DonationPage },
    { path: 'user-donation', component: UserDonationPage },
] as Routes;
