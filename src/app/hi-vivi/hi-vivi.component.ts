import { Component } from '@cspruit/vivi';
import { HiViviService } from 'app/services/hi-vivi.service';

export class HiViviComponent extends Component {
    constructor(private hiViviService: HiViviService) {
        super();
    }
}