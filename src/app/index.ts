// External imports
import { ModuleFactory } from '@cspruit/vivi';

// Internal imports
import { ContainerComponent } from './container/container.component';
import { HiViviComponent } from './hi-vivi/hi-vivi.component';
import { HiViviService } from './services/hi-vivi.service';
import { ElectronService } from './services/electron';
import { FileStoreService } from './services/file-store';
import { SystemService } from './services/system';
import { FileService } from './services/file';

export const vivi: ModuleFactory = new ModuleFactory({
    componentConstructors: [
        { constructor: ContainerComponent },
        { constructor: HiViviComponent, services: [HiViviService] }
    ],
    serviceConstructors: [
        { constructor: ElectronService },
        { constructor: HiViviService },
        { constructor: SystemService },
        { constructor: FileService, prereqArr: [SystemService] },
        { constructor: FileStoreService, prereqArr: [ElectronService, FileService] },
    ],
    rootComponent: ContainerComponent
});