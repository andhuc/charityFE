import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { Donation, DonationService } from '../../../services/donation/donation.service';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { ApiResponse, PagedResult } from '../../../../app.constant';
import { Router } from '@angular/router';

@Component({
    selector: 'campaign-widget',
    imports: [DividerModule, ButtonModule, RippleModule, CommonModule, ProgressBarModule],
    template: `
    <div id="campaign" class="py-6 px-6 lg:px-20 my-2 md:my-6">
      <div class="text-center mb-6">
        <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Running Campaign</div>
        <span class="text-muted-color text-2xl">Amet consectetur adipiscing elit...</span>
      </div>

      <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
        <!-- Display campaigns dynamically -->
        <div *ngFor="let campaign of donationCampaigns" class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
          <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 campaign-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
            <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">{{ campaign.title }}</div>
            <div class="relative w-full" style="padding-top: 133.33%;"> <!-- 3:4 ratio, 100 * 3/4 = 75% -->
                <img src="{{ campaign.imageUrl }}" class="absolute top-0 left-0 w-full h-full object-cover mx-auto" alt="campaign image" />
            </div>
            <div class="my-8 flex flex-col items-center gap-4">
              <div class="flex items-center">
                <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">{{ campaign.raisedAmount }}</span>
                <span class="text-surface-600 dark:text-surface-200">raised of {{ campaign.goalAmount }}</span>
              </div>
              <p-progressBar [value]="(campaign.raisedAmount / campaign.goalAmount) * 100" [showValue]="false" class="w-full mt-4"></p-progressBar>

              <button pButton pRipple label="Donate" class="p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white" 
                (click)="onDonateClick(campaign.id)"></button>
              
            </div>
            <p-divider class="w-full bg-surface-200"></p-divider>
            <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
              <li class="py-2">
                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">{{ campaign.description | slice:0:50 }}</span>
            </li>
              <li class="py-2">
                <i class="pi pi-fw pi-calendar text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">Start: {{ campaign.startDate }}</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-calendar text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">End: {{ campaign.endDate }}</span>
              </li>
              <li class="py-2">
                <i class="pi pi-fw pi-circle text-xl text-cyan-500 mr-2"></i>
                <span class="text-xl leading-normal">Status: {{ campaign.status }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CampaignWidget implements OnInit {
    donationCampaigns: Donation[] = [];

    constructor(private donationService: DonationService, private router: Router) { }

    ngOnInit() {
        this.fetchDonations();
    }

    fetchDonations(page: number = 1, size: number = 100, search: string = ''): void {
        this.donationService.getDonations(page, size, search).subscribe(
            (response: ApiResponse<PagedResult<Donation>>) => {
                response.data.queryable.forEach((campaign) => {
                    campaign.imageUrl = this.setRandomImage();
                });
                this.donationCampaigns = response.data.queryable;
            },
            (error) => {
                console.error('Error fetching donations:', error);
            }
        );
    }

    setRandomImage() {
        const images = [
            'https://img.freepik.com/free-vector/hand-drawn-world-blood-donor-day-horizontal-banners-collection_23-2149413039.jpg?semt=ais_hybrid&w=740',
            'https://marketplace.canva.com/EAFG5wKTkFk/1/0/1131w/canva-pastel-food-drive-a4-flyer-tBm19VC3AKU.jpg',
            'https://thumbs.dreamstime.com/b/blood-donation-promo-poster-heart-dripping-blood-heart-red-drop-ribbon-banner-donate-blood-share-life-message-115098465.jpg',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqqg7R-FR3qauDVmZem1PiDaLunSlszI5pnw&s',
            'https://c8.alamy.com/comp/2JPWFPK/make-a-donation-vector-illustration-charity-and-donation-poster-design-hands-with-hearts-2JPWFPK.jpg',
            'https://edit.org/img/blog/exo-banner-poverty-template-edit-online.webp',
            'https://i.pinimg.com/736x/17/8d/ff/178dff7d4c5f16554d3184dfd0129225.jpg',
            'https://i.pinimg.com/736x/2e/db/95/2edb95e19be314e364ef8e75c258cf6f.jpg',
            'https://pmedia.launchgood.com/134090/water_for_all__give_the_best_charity_Palestine%20-%20Pakistan%20-%20Uganda%20-%20Togo-699x525.png',
            'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/clean-water-protection-campaign-poster-design-template-aa46f9e8d355539058fa9d0d13f96dd4_screen.jpg?ts=1636988514'
        ];
        return images[Math.floor(Math.random() * images.length)];
    }

    onDonateClick(campaignId: number | undefined): void {
      this.router.navigate(['/donate'], { queryParams: { id: campaignId } });
    }

}
