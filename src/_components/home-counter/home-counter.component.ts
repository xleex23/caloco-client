import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-counter',
  templateUrl: './home-counter.component.html',
  styleUrls: ['./home-counter.component.scss'],
  imports: [CommonModule]
})
export class HomeCounterComponent {
    public active_tab: string = 'add';
    public current_total: number = 0;

    constructor() {}

    toggleTab(tab: string) {
        this.active_tab = tab;
    }
}
