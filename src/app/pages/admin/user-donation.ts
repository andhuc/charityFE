import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { UserDonation, UserDonationService } from '../../services/userDonation/userDonation.service';
import { Notyf } from 'notyf';
const notyf = new Notyf();

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-user-donation',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        DropdownModule,
        EditorModule
    ],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedItems()" [disabled]="!selectedItems || !selectedItems.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="items()"
            [lazy]="true"
            (onLazyLoad)="onPage($event)"
            [rows]="rows"
            [first]="first"
            [totalRecords]="totalRecords"
            [loading]="loading"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedItems"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Management</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th pSortableColumn="title">Donation<p-sortIcon field="title" /></th>
                    <th pSortableColumn="goalAmount">User<p-sortIcon field="goalAmount" /></th>
                    <th pSortableColumn="raisedAmount">Amount<p-sortIcon field="raisedAmount" /></th>
                </tr>
            </ng-template>
            <ng-template #body let-item>
                <tr>
                    <td>{{ item.donationTitle }}</td>
                    <td>{{ item.userFullname }}</td>
                    <td>{{ item.amount | currency: 'VND' }}</td>
                </tr>
            </ng-template>
        </p-table>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, UserDonationService, ConfirmationService]
})
export class UserDonationPage implements OnInit {
    itemDialog: boolean = false;

    items = signal<UserDonation[]>([]);

    item: UserDonation | null = null;

    selectedItems!: UserDonation[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    rows: number = 10;
    totalRecords: number = 0;
    loading: boolean = false;
    first: number = 0;

    statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    onPage(event: any) {
        const page = event.first / event.rows + 1;
        this.rows = event.rows;
        this.first = event.first;
        this.loadData(page, this.rows);
    }

    constructor(
        private itemService: UserDonationService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadData();
    }

    loadData(page = 1, size = 10, search = '') {
        this.loading = true;
        this.itemService.getUserDonations(page, size, search).subscribe((response) => {
            this.items.set(response.data.queryable);
            this.totalRecords = response.data.rowCount;
            this.loading = false;
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.first = 0;
        this.loadData(1, this.rows, value);
    }

    deleteSelectedItems() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected items?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (this.selectedItems) {
                    this.selectedItems.forEach((item) => {
                        if (item.id !== undefined) {
                            this.itemService.deleteUserDonation(item.id).subscribe(
                                () => {
                                    this.items.set(this.items().filter((val) => val.id !== item.id));
                                    this.selectedItems = null;
                                    notyf.success('Items Deleted');
                                },
                                (error) => {
                                    notyf.error('Failed to delete the items');
                                }
                            );
                        }
                    });
                }
            }
        });
    }

    hideDialog() {
        this.itemDialog = false;
        this.submitted = false;
    }

    deleteItem(item: UserDonation) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this item?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (item.id !== undefined) {
                    this.itemService.deleteUserDonation(item.id).subscribe(
                        () => {
                            this.items.set(this.items().filter((val) => val.id !== item.id));
                            this.item = null;
                            notyf.success('Item Deleted');
                        },
                        (error) => {
                            notyf.error('Failed to delete the item');
                        }
                    );
                }
            }
        });
    }

    saveItem() {
        this.submitted = true;

        if (!this.item) {
            notyf.error('Please fill the form');
            return;
        }

        if (this.item.id) {
            // Update
            this.itemService.updateUserDonation(this.item).subscribe(() => {
                const _items = this.items().map(u => u.id === this.item!.id ? this.item! : u);
                this.items.set(_items);
                notyf.success('Item Updated');
                this.itemDialog = false;
                this.item = null;
            });
        } else {
            // Create
            this.itemService.addUserDonation(this.item).subscribe((createdUserDonation) => {
                this.loadData();
                notyf.success('Item Created');
                this.itemDialog = false;
                this.item = null;
            });
        }
    }
}
