import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Notyf } from 'notyf';
const notyf = new Notyf();

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <img src="https://cdn-icons-png.flaticon.com/512/3047/3047825.png" class="mb-8 mx-auto" style="width: 50px; height: 50px" />
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to ECharity!</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                            </div>

                            <button pButton label="Login" class="w-full" (click)="login()"></button>

                            <div class="text-center mt-4">
                                <a routerLink="/register" class="text-primary font-medium">Don't have an account? Register</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class Login {
    email: string = '';
    password: string = '';
    checked: boolean = false;

    constructor(private authService: AuthService, private router: Router) { }

    login() {
        if (this.email && this.password) {
            this.authService.login(this.email, this.password).subscribe({
                next: (response: any) => {
                    if (response && response.success) {
                        localStorage.setItem('tok', response.token || response.data);
                        notyf.success('Login successful!');
                        this.router.navigate(['/dashboard']);
                    } else {
                        notyf.error(response.message || 'Login failed. Please check your credentials.');
                    }
                },
                error: (error: any) => {
                    notyf.error('Login failed. Please check your credentials.');
                }
            });
        } else {
            notyf.error('Please enter both email and password.');
        }
    }
}
