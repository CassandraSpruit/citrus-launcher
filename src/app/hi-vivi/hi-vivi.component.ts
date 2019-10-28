import { Component, ViviElement } from '@cspruit/vivi';
import { HiViviService } from 'app/services/hi-vivi.service';

export class HiViviComponent extends Component {
    @ViviElement({ selector: 'span.start' }) private startSpan: HTMLSpanElement;

    constructor(private hiViviService: HiViviService) {
        super();
    }

    load() {
        this.startSpan.innerHTML = this.hiViviService.getStart();
    }
}