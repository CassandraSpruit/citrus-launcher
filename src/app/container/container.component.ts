import { Component, ViviElement, EventTypes } from '@cspruit/vivi';
import { ResourcesService } from '../services/resources.service';
import { CheckerService } from '../services/checker.service';
import { ForgeListItem } from '../models/forge-list-item';
import { AxiosResponse } from 'axios';
import { ForgeInstance } from '../models/forge-instance';
import { ForgeLibrary } from '../models/forge-version';
import * as flyd from 'flyd';
import { AsyncSubject, Subject } from 'rxjs';

export class ContainerComponent extends Component {
    @ViviElement({ selector: 'button.install', handlerFnName: 'install', eventType: EventTypes.click }) installButton: HTMLButtonElement;

    constructor(
        private resources: ResourcesService,
        private checker: CheckerService
    ) {
        super();
    }

    install() {
        /* Minecraft Launcher */
        const launcherDir = this.checker.checkMinecraftLauncherFolder();
        if (!launcherDir) {
            this.appEvents.sendEvent('checklist:progress:minecraft-launcher', { status: 'error', message: 'Minecraft Launcher folder not found.' });
            // TODO: Propmt user for location
            return;
        }
        const launcherStatus = this.checker.checkMinecraftLauncherHasBeenLaunched();
        if (!launcherStatus.success) {
            this.appEvents.sendEvent('checklist:progress:minecraft-launcher', { status: 'error', message: launcherStatus.message });
            return;
        }
        this.appEvents.sendEvent('checklist:minecraft-launcher', 'success');

        /* Minecraft Installed */
        const minecraftDir = this.checker.checkMinecraftFolder();
        if (!minecraftDir.success) {
            this.appEvents.sendEvent('checklist:progress:minecraft', { status: 'error', message: minecraftDir.message });
            // TODO: Propmt user to open and play game
            return;
        }
        this.appEvents.sendEvent('checklist:minecraft', 'success');

        /* Forge */
        // TODO: Check if Forge is installed
        this.resources.getForgeList().then(this.parseForgeList.bind(this));
    }

    private parseForgeList(res: AxiosResponse<Array<ForgeListItem>>) {
        this.appEvents.sendEvent('checklist:progress:forge', { status: 'progress', message: 'Forge list found. Auto-selecting 28.1.92. ' });
        const forgeList = res.data;
        // TODO: Add selector
        const specificForge = forgeList.find(forgeli => forgeli.name === 'forge-28.1.92');
        if (!specificForge) {
            this.appEvents.sendEvent('checklist:progress:forge', { status: 'error', message: 'Forge 28.1.92 not found!' });
            return;
        }

        this.resources.getForgeDetails(specificForge).then(this.parseForgeInstance.bind(this));
    }

    private parseForgeInstance(res: AxiosResponse<ForgeInstance>) {
        const forgeInstance = new ForgeInstance(res.data);

        if (!forgeInstance) {
            this.appEvents.sendEvent('checklist:progress:forge', { status: 'error', message: 'Forge 28.1.92 not found on server.' });
            return;
        }

        // Download Forge
        this.resources.getForgeFile(forgeInstance).then(() => {
            this.appEvents.sendEvent('checklist:progress:forge', { status: 'progress', message: 'Downloaded forge.'});
        });

        // Download Libraries
        const counter = new Subject<number>();
        let count = 0;
        counter.subscribe((count) => {
            if (count === forgeInstance.versionObj.libraries.length) {
                // Done!
                this.appEvents.sendEvent('checklist:progress:forge', { status: 'progress', message: 'Downloaded all libraries.'});
                this.installLibraries(forgeInstance);
            }
        });

        forgeInstance.versionObj.libraries.forEach(library => {
            this.resources.getForgeLibrary(library).then(() => {
                count++;
                counter.next(count);
                this.appEvents.sendEvent('checklist:progress:forge', { status: 'progress', message: `Downloaded Library: ${library.name}.` });
            });
        });
    }

    private installForge(forgeInstance: ForgeInstance) {
        
        const result = this.checker.installLauncher(forgeInstance);
        
        if (result) {
            this.appEvents.sendEvent('checklist:progress:forge', { status: 'progress', message: 'Forge Successfully installed. '});
            this.appEvents.sendEvent('checklist:forge', 'success');       
        } else {
            this.appEvents.sendEvent('checklilst:progress:forge', { status: 'error', message: 'Forge did not install.'});
            this.appEvents.sendEvent('checklist:forge', 'error');
        }
    }

    private installLibraries(forgeInstance: ForgeInstance) {
        this.checker.installForgeLibraries().then(() => {
            this.appEvents.sendEvent('checklist:progress:forge', { status: 'progress', message: 'Forge Successfully installed libraries. '});
            this.installForge(forgeInstance);        
        }).catch(err => {
            this.appEvents.sendEvent('checklilst:progress:forge', { status: 'error', message: err});
            this.appEvents.sendEvent('checklist:forge', 'error');
        });
    }
}