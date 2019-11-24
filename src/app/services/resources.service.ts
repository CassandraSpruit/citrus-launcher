import { Service } from '@cspruit/vivi';
import { ElectronService } from './electron';
import { ForgeListItem } from '../models/forge-list-item';
import { ForgeLibrary } from '../models/forge-version';
import { SystemService } from './system';
import { ForgeInstance } from '../models/forge-instance';

export class ResourcesService extends Service {
    private readonly twitchApi = 'https://addons-ecs.forgesvc.net/api/v2/minecraft/';
    private appDirectory: string;

    constructor(
        private electron: ElectronService,
        private system: SystemService
    ) {
        super();
        this.appDirectory = electron.remote.app.getPath('userData');
    }

    getForgeList() {
        return this.electron.axios.get<Array<ForgeListItem>>(`${this.twitchApi}modloader`);
    }

    getForgeDetails(forgeLi: ForgeListItem) {
        return this.electron.axios.get(`${this.twitchApi}modloader/${forgeLi.name}`);
    }

    getForgeLibrary(library: ForgeLibrary) {
        const url = library.downloads.artifact.url;
        const path = this.electron.path.join(this.appDirectory, 'downloads', 'forge', library.downloads.artifact.path);
        this.system.fs.ensureFileSync(path);
        const writer = this.system.fs.createWriteStream(path);
        this.electron.axios.get(url, { responseType: 'stream' }).then(res => {
            res.data.pipe(writer);
        });
        
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }

    getForgeFile(forge: ForgeInstance) {
        const url = forge.downloadUrl;
        const path = this.electron.path.join(this.appDirectory, 'downloads', 'forge', forge.name + '.jar');
        this.system.fs.ensureFileSync(path);
        const writer = this.system.fs.createWriteStream(path);
        this.electron.axios.get(url, { responseType: 'stream' }).then(res => {
            res.data.pipe(writer);
        });
        
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }

    getMods(modlist: Array<string>) {
        //
    }
}