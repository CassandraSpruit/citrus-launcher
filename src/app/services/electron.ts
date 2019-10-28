import { Service } from '@cspruit/vivi/models';
import { remote, ipcRenderer } from 'electron';

export class ElectronService extends Service {
    // Electron
    ipcRenderer: typeof ipcRenderer;
    remote: typeof remote;

    constructor() {
        super();
        if (window.require) {
            const electron = window.require('electron');
            this.remote = electron.remote;
            this.ipcRenderer = electron.ipcRenderer;
        }
    }

    isElectron() {
        return !!window.require;
    }
}