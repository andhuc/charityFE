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
import { User, UserService } from '../../services/user/user.service';
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
    selector: 'app-user',
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
        ConfirmDialogModule
    ],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
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
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th style="min-width: 16rem">Fullname</th>
                    <th pSortableColumn="name" style="min-width:16rem">
                        Username
                        <p-sortIcon field="name" />
                    </th>
                    <th pSortableColumn="price" style="min-width: 8rem">
                        Email
                        <p-sortIcon field="price" />
                    </th>
                    <th pSortableColumn="rating" style="min-width: 12rem">
                        Role
                        <p-sortIcon field="rating" />
                    </th>
                    <th pSortableColumn="inventoryStatus" style="min-width: 12rem">
                        Action
                        <p-sortIcon field="inventoryStatus" />
                    </th>
                </tr>
            </ng-template>
            <ng-template #body let-item>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="item" />
                    </td>
                    <td style="min-width: 12rem">{{ item.fullName }}</td>
                    <td style="min-width: 16rem">{{ item.username }}</td>
                    <td style="min-width: 16rem">{{ item.email }}</td>
                    <td>
                        <p-tag 
                            [value]="item.role === 1 ? 'Admin' : 'User'" 
                            [severity]="item.role === 1 ? 'danger' : 'info'" />
                    </td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editItem(item)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteItem(item)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="itemDialog" [style]="{ width: '450px' }" header="Item Details" [modal]="true">
            <ng-template #content>
                <div *ngIf="item" class="flex flex-col gap-5 p-4">
                    <div class="field">
                        <label for="fullName" class="font-medium text-lg">Full Name</label>
                        <input 
                            id="fullName" 
                            type="text" 
                            pInputText 
                            [(ngModel)]="item.fullName" 
                            required 
                            autofocus
                            class="p-inputtext w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div class="field">
                        <label for="username" class="font-medium text-lg">Username</label>
                        <input 
                            id="username" 
                            type="text" 
                            pInputText 
                            [(ngModel)]="item.username" 
                            required
                            class="p-inputtext w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div class="field">
                        <label for="email" class="font-medium text-lg">Email</label>
                        <input 
                            id="email" 
                            type="email" 
                            pInputText 
                            [(ngModel)]="item.email" 
                            required
                            class="p-inputtext w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div class="field">
                        <label class="font-medium text-lg">Role</label>
                        <div class="flex gap-6">
                            <div class="p-field-radiobutton">
                                <p-radioButton 
                                    name="role" 
                                    [value]="1" 
                                    [(ngModel)]="item.role" 
                                    inputId="admin" 
                                    class="p-radiobutton"
                                ></p-radioButton>
                                <label for="admin">Admin</label>
                            </div>

                            <div class="p-field-radiobutton">
                                <p-radioButton 
                                    name="role" 
                                    [value]="2" 
                                    [(ngModel)]="item.role" 
                                    inputId="user" 
                                    class="p-radiobutton"
                                ></p-radioButton>
                                <label for="user">User</label>
                            </div>
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="saveItem()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, UserService, ConfirmationService]
})
export class UserPage implements OnInit {
    itemDialog: boolean = false;

    items = signal<User[]>([]);

    item: User | null = null;

    selectedItems!: User[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    rows: number = 10;
    totalRecords: number = 0;
    loading: boolean = false;
    first: number = 0;

    onPage(event: any) {
        const page = event.first / event.rows + 1;
        this.rows = event.rows;
        this.first = event.first;
        this.loadData(page, this.rows);
    }

    constructor(
        private itemService: UserService,
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
        this.itemService.getUsers(page, size, search).subscribe((response) => {
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

    openNew() {
        this.item = {
            id: 0,
            fullName: '',
            username: '',
            email: '',
            role: 2
        };
        this.submitted = false;
        this.itemDialog = true;
    }


    editItem(item: User) {
        this.item = { ...item };
        this.itemDialog = true;
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
                            this.itemService.deleteUser(item.id).subscribe(
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

    deleteItem(item: User) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this item?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (item.id !== undefined) {
                    this.itemService.deleteUser(item.id).subscribe(
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

        if (!this.item?.fullName?.trim() || !this.item.username?.trim() || !this.item.email?.trim()) {
            return;
        }

        if (this.item.id) {
            // Update
            this.itemService.updateUser(this.item).subscribe(() => {
                const _items = this.items().map(u => u.id === this.item!.id ? this.item! : u);
                this.items.set(_items);
                notyf.success('Item Updated');
                this.itemDialog = false;
                this.item = null;
            });
        } else {
            // Create
            this.itemService.addUser(this.item).subscribe((createdUser) => {
                this.loadData();
                notyf.success('Item Created');
                this.itemDialog = false;
                this.item = null;
            });
        }
    }
}
