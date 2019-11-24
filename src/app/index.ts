// External imports
import { ModuleFactory } from '@cspruit/vivi';
import { LoadingIconComponent, MessageComponent, EditableComponent } from '@cspruit/vivi-ui/components';

// Internal imports
import { ContainerComponent } from './container/container.component';
import { ResourcesService } from './services/resources.service';
import { ElectronService } from './services/electron';
import { FileStoreService } from './services/file-store';
import { SystemService } from './services/system';
import { FileService } from './services/file';
import { ChecklistItemComponent } from './checklist-item/checklist-item.component';
import { CheckerService } from './services/checker.service';

export const vivi: ModuleFactory = new ModuleFactory({
    componentConstructors: [
        { constructor: ContainerComponent, services: [ResourcesService, CheckerService] },
        { constructor: ChecklistItemComponent },
        { constructor: LoadingIconComponent },
        { constructor: MessageComponent },
        { constructor: EditableComponent }
    ],
    serviceConstructors: [
        { constructor: ElectronService },
        { constructor: SystemService },
        { constructor: FileService, prereqArr: [SystemService] },
        { constructor: ResourcesService, prereqArr: [ElectronService, SystemService] },
        { constructor: FileStoreService, prereqArr: [ElectronService, FileService] },
        { constructor: CheckerService, prereqArr: [ElectronService, SystemService, FileService] }
    ],
    rootComponent: ContainerComponent
});