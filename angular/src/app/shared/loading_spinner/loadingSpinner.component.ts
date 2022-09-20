import { Component, OnInit, Input } from '@angular/core';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'loading-spinner',
    templateUrl: './loadingSpinner.component.html'
})
// tslint:disable-next-line: component-class-suffix
export class LoadingSpinner implements OnInit {
    @Input() IsLoading!: boolean;

    mode = 'indeterminate';
    diameter = 40;

    @Input() set Diameter(value: number) {
        this.diameter = value;
    }

    constructor() {
    }

    ngOnInit() {

    }
}