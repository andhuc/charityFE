import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbarwidget.component';
import { FooterWidget } from './components/footerwidget';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Donation, DonationService } from '../../services/donation/donation.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { Notyf } from 'notyf';
import { PaymentService } from '../../services/payment/payment.service';
const notyf = new Notyf();

@Component({
    selector: 'app-donate',
    standalone: true,
    imports: [CommonModule, ProgressBarModule, RouterModule, TopbarWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, FooterWidget, FormsModule],
    template: `
    <div class="bg-surface-0 dark:bg-surface-900">
      <div id="home" class="landing-wrapper overflow-hidden">
        <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static"></topbar-widget>

        <div class="py-12 px-6 mx-auto max-w-lg">
          <!-- Donation Form -->
          <div *ngIf="donation" class="text-center mb-8">
            <h2 class="text-3xl font-semibold text-surface-900 dark:text-surface-0">{{ donation.title }}</h2>
            <p class="text-lg text-surface-600 dark:text-surface-200">{{ donation.description }}</p>
            <p class="text-xl text-surface-800 dark:text-surface-100 font-bold mt-4">Goal: {{ donation.goalAmount }}</p>

            <!-- Raised Amount -->
            <div class="flex items-center justify-center mt-6">
              <i class="pi pi-wallet text-2xl mr-2"></i>
              <p class="text-lg text-surface-800 dark:text-surface-100">Raised: {{ donation.raisedAmount }}</p>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4">
              <div class="progress-bar-container mb-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-surface-600 dark:text-surface-200">Raised</span>
                  <span class="text-sm text-surface-600 dark:text-surface-200">Goal</span>
                </div>
                <p-progressBar [value]="raisedPercentage" [showValue]="true" styleClass="w-full mt-2"></p-progressBar>
              </div>
            </div>

            <!-- Dates -->
            <div class="flex justify-between items-center mt-4">
              <div class="flex items-center">
                <i class="pi pi-calendar text-lg mr-2"></i>
                <p class="text-sm text-surface-600 dark:text-surface-200">Start: {{ donation.startDate | date: 'MM/dd/yyyy' }}</p>
              </div>
              <div class="flex items-center">
                <i class="pi pi-calendar-times text-lg mr-2"></i>
                <p class="text-sm text-surface-600 dark:text-surface-200">End: {{ donation.endDate | date: 'MM/dd/yyyy' }}</p>
              </div>
            </div>
          </div>

          <!-- Donation Form -->
          <div class="bg-white dark:bg-surface-800 rounded-lg shadow-lg p-6">
            <form (ngSubmit)="onSubmit()">
              <div class="mb-4">
                <label for="amount" class="block text-lg text-surface-900 dark:text-surface-0 font-medium">Enter Donation Amount</label>
                <input
                  id="amount"
                  type="number"
                  [(ngModel)]="donationAmount"
                  name="donationAmount"
                  class="p-inputtext p-component p-filled w-full mt-2"
                  placeholder="Amount in USD"
                  min="1"
                  required
                />
              </div>

              <div class="mb-6">
                <button pButton pRipple type="submit" label="Donate" class="p-button-primary w-full"></button>
              </div>
            </form>
          </div>

        </div>

        <footer-widget></footer-widget>
      </div>
    </div>
  `,
})
export class Donate implements OnInit {
    donationAmount: number = 0;
    donationId: number = 0;
    donation: Donation | null = null;
    raisedPercentage: number = 0;

    constructor(private route: ActivatedRoute, private router: Router, private donationService: DonationService, private paymentService: PaymentService) { }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.donationId = params['id'];
            if (params['successP']) notyf.success('Donate successful!');
        });

        if (this.donationId) {
            this.donationService.getDonationById(this.donationId).subscribe(
                (response) => {
                    if (response.success) {
                        this.donation = response.data;
                        this.updateProgressBar();
                    } else {
                        notyf.error('Failed to fetch donation details.');
                    }
                },
                (error) => {
                    notyf.error('Error fetching donation details.');
                }
            );
        } else {
            this.router.navigate(['/campaign']);
            notyf.error('Invalid donation ID.');
        }
    }

    updateProgressBar() {
        if (this.donation) {
            const { goalAmount, raisedAmount } = this.donation;
            this.raisedPercentage = (raisedAmount / goalAmount) * 100;
        }
    }

    async onSubmit() {
        if (!localStorage.getItem('tok')) {
            this.router.navigate(['/login'], { queryParams: { ref: this.donationId } });
            notyf.error('Please login to donate.');
            return;
        }

        if (this.donationAmount > 0) {

            this.paymentService.payment({amount: this.donationAmount, donationId: this.donationId}).subscribe({
                next: (response) => {
                    if (response.success && response.data) {
                        window.location.href = response.data;
                    } else {
                        notyf.error('Payment failed. Please try again.');
                    }
                },
                error: (error) => {
                    notyf.error('Error processing payment. Please try again.');
                }
            })

        } else {
            notyf.error('Please enter a valid donation amount.');
        }
    }
}
