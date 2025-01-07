import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IntegerDirective } from 'src/_directives/integer.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-counter',
  templateUrl: './home-counter.component.html',
  styleUrls: ['./home-counter.component.scss'],
  imports: [CommonModule, IntegerDirective, ReactiveFormsModule]
})
export class HomeCounterComponent {
    public integer_input: FormControl = new FormControl();
    public active_count_tab: string = 'add';
    public active_macro_tab: string = 'cals';
    public current_cal: number = 2399;
    public current_pro: number = 189;
    private validCombinations = {
        add: {
          cals: () => {
            this.current_cal += this.integer_input.value;
          },
          pro: () => {
            this.current_pro += this.integer_input.value;
          },
        },
        subtract: {
          cals: () => {
            this.current_cal -= this.integer_input.value;
          },
          pro: () => {
            this.current_pro -= this.integer_input.value;
          },
        }
    };

    constructor() {}

    toggleTab(tabType: 'count' | 'macro', value: string) {
        if (tabType === 'count') {
            this.active_count_tab = value;
        } else if (tabType === 'macro') {
            this.active_macro_tab = value;
        }
    }

    update() {
        if (!this.integer_input.value) {
            return
        }
        const countTab = this.active_count_tab;
        const macroTab = this.active_macro_tab;
        this.validCombinations[countTab]?.[macroTab]?.();
        this.integer_input.setValue(null)
    }
}
