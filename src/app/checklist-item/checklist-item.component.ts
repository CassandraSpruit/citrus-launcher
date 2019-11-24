import { Component } from '@cspruit/vivi';

export class ChecklistItemComponent extends Component {
    data: {
        id: string;
        display: string;
        defaultState: string;
    }

    private iconName: string;
    private messageName: string;

    load() {
        this.iconName = `${this.data.id}-icon`;
        this.messageName = `${this.data.id}-message`;
        this.appListen(`checklist:${this.data.id}`, this.handleChange.bind(this));
        this.appListen(`checklist:progress:${this.data.id}`, this.handleMessage.bind(this));
    }

    handleChange(state: string) {
        switch(state) {
            case 'success':
                this.appEvents.sendEvent(`loading:${this.iconName}`, { state });
                this.appEvents.sendEvent(`message:clear:${this.messageName}`);
                break;
            case 'error':
                this.appEvents.sendEvent(`loading:${this.iconName}`, { state });
                break;
            case 'pause':
            case 'pending':
            default:
                this.appEvents.sendEvent(`loading:${this.iconName}`);
                return;
        }
    }

    handleMessage(data: { status: string, message: string }) {
        this.appEvents.sendEvent(`message:${this.messageName}`, data);
    }
}