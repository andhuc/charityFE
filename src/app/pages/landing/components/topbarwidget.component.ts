import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, CommonModule],
    template: `
        <a class="flex items-center" href="#">
            <img src="https://cdn-icons-png.flaticon.com/512/3047/3047825.png" class="mr-4" style="width: 40px; height: 40px" />
            <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl leading-normal mr-20">ECharity</span>
        </a>

        <a pButton [text]="true" severity="secondary" [rounded]="true" pRipple class="lg:!hidden" pStyleClass="@next" enterClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true">
            <i class="pi pi-bars !text-2xl"></i>
        </a>

        <div class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
            <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                <li>
                    <a (click)="router.navigate(['/landing'], { fragment: 'home' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Home</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/landing'], { fragment: 'features' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Features</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/landing'], { fragment: 'highlights' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Highlights</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/campaign'])" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Campaign</span>
                    </a>
                </li>
            </ul>

            <!-- Conditional Rendering for Login/Register or Profile -->
            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
                <!-- Check if token exists in localStorage -->
                <ng-container *ngIf="!token; else profileLink">
                    <button pButton pRipple label="Login" routerLink="/login" [rounded]="true" [text]="true"></button>
                    <button pButton pRipple label="Register" routerLink="/register" [rounded]="true"></button>
                </ng-container>
                
                <ng-template #profileLink>
                    <button pButton pRipple label="Profile" routerLink="/profile" [rounded]="true"></button>
                    <button pButton pRipple label="Logout" (click)="logout()" [rounded]="true" [text]="true"></button>
                </ng-template>
            </div>
        </div>
    `
})
export class TopbarWidget {
    token: string | null = localStorage.getItem('tok');

    constructor(public router: Router) {}

    logout() {
        this.token = null;
        localStorage.removeItem('tok');
        this.router.navigate(['/']);
    }
}