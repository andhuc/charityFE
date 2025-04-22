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
    selector: 'app-register',
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

                            <label for="retypePassword" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Retype Password</label>
                            <p-password id="retypePassword" [(ngModel)]="retypePassword" placeholder="Retype Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <button pButton label="Register" class="w-full" (click)="register()"></button>

                            <div class="text-center mt-4">
                                <a routerLink="/login" class="text-primary font-medium">Already have an account? Login</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class Register {
    email: string = '';
    password: string = '';
    retypePassword: string = '';

    constructor(private authService: AuthService, private router: Router) { }

    register() {
        if (!this.email || !this.password || !this.retypePassword) {
            notyf.error('Please fill in all fields.');
            return;
        }

        if (this.password !== this.retypePassword) {
            notyf.error('Passwords do not match.');
            return;
        }

        if (this.email && this.password) {
            this.authService.register(this.email, this.password).subscribe({
                next: (response: any) => {
                    if (response && response.success) {
                        localStorage.setItem('ve', this.email);
                        notyf.success('Register successful!');
                        this.router.navigate(['/verify']);
                    } else {
                        notyf.error(response.message || 'Register failed. Please try again.');
                    }
                },
                error: (error: any) => {
                    notyf.error('Register failed');
                }
            });
        }
    }
}
