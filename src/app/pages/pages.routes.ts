import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { UserPage } from './admin/user';

export default [
    { path: 'crud', component: Crud },
    { path: 'user', component: UserPage },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
