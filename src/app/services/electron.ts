import { Service } from '@cspruit/vivi/models';
import { remote, ipcRenderer } from 'electron';
import * as axios from 'axios';
import * as Store from 'electron-store';
import * as path from 'path';

export class ElectronService extends Service {
    // Electron
    ipcRenderer: typeof ipcRenderer;
    remote: typeof remote;
    axios: typeof axios.default;
    store: Store<any>;
    path: typeof path;

    constructor() {
        super();
        if (window.require) {
            const electron = window.require('electron');
            this.remote = electron.remote;
            this.ipcRenderer = electron.ipcRenderer;
            this.axios = window.require('axios').default;
            this.store = new Store();
            this.path = window.require('path');
        }
    }

    isElectron() {
        return !!window.require;
    }
}