import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataModel, HomeServiceService } from 'src/app/services/home-service.service';

@Component({
  selector: 'app-home-counter',
  templateUrl: './home-counter.component.html',
  styleUrls: ['./home-counter.component.scss'],
  imports: [CommonModule]
})
export class HomeCounterComponent {
    public someForm: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone_number: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
        student_id: ['', Validators.required, Validators.pattern(/^\d+$/)]
    })
    private data: any[] = [];
    private errorMessage: string = '';


    constructor(
        private fb: FormBuilder,
        private homeSrv: HomeServiceService
    ) {}

    fetchData() {
        this.homeSrv.getData().subscribe({
            next: (res) => {
                this.data = res;
            },
            error: (error) => {
                console.error('Error getting items:', error);
                this.errorMessage = error.message;
            }
        })
    }

    createItem() {
        const payload = this.someForm.value;
        this.homeSrv.createNew(payload).subscribe({
            next: (res) => {
                if (res) {
                    this.data.push(res);
                    this.someForm.reset();
                }
            },
            error: (error) => {
                console.error('Error creating item:', error);
                this.errorMessage = error.message;
            }
        })
    }

    updateItem() {
        const payload = this.someForm.value;
        this.homeSrv.updateItem(payload).subscribe({
            next: (res) => {
                this.someForm.reset();
                const itemIndex = this.data.findIndex(item => item.id === res.id);
                if (itemIndex !== -1) {
                    this.data[itemIndex] = res;
                }
            },
            error: (error) => {
                console.error('Error updating item:', error);
                this.errorMessage = error.message
            }
        })
    }
}
