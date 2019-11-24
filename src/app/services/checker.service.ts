import { Service } from '@cspruit/vivi'
import { FileService } from './file';
import { ElectronService } from './electron';
import { SystemService } from './system';
import { ForgeLibrary } from '../models/forge-version';
import { ForgeInstance } from '../models/forge-instance';

export class CheckerService extends Service {
    // Application
    private appDirectory: string;

    // Launcher
    private readonly defaultLauncherLocation = `C:\\Program Files (x86)\\Minecraft Launcher`;
    private lastValidLauncherLocation: string;
    private readonly defaultLauncherName = 'MinecraftLauncher';

    // Minecraft
    private readonly defaultMinecraftFolder = `C:\\Users\\Cassandra\\AppData\\Roaming\\.minecraft`;

    // Forge
    private readonly defaultMinecraftLibrary = this.defaultMinecraftFolder + '\\libraries';

    constructor(
        private electron: ElectronService,
        private system: SystemService,
        private file: FileService
    ) {
        super();
        this.lastValidLauncherLocation = this.electron.store.get('lastValidLauncherLocation') || this.defaultLauncherLocation;
        this.appDirectory = electron.remote.app.getPath('userData');
        if (!this.file.existsDirectory(this.appDirectory, 'downloads')) {
            this.file.createDirectoryAsync(this.appDirectory, 'downloads').subscribe();
            this.file.createDirectoryAsync(this.electron.path.join(this.appDirectory, 'downloads'), 'forge');
            this.file.createDirectoryAsync(this.electron.path.join(this.appDirectory, 'downloads'), 'mods');
        }
    }

    /* Launcher */
    checkMinecraftLauncherFolder(dir?: string): boolean {
        if (!dir) {
            dir = this.lastValidLauncherLocation;
        }

        const exists = this.system.fs.existsSync(dir);
        // Store this
        if (exists) {
            this.lastValidLauncherLocation = dir;
        }
        return exists;
    }

    checkMinecraftLauncherHasBeenLaunched(): { success: boolean, message?: string } {
        const launcherExists = this.file.existsFile(this.lastValidLauncherLocation, this.defaultLauncherName, '.exe');
        if (!launcherExists) {
            return { success: false, message: 'Minecraft Launcher not found.' };
        }
        const gameFolderExists = this.file.existsDirectory(this.lastValidLauncherLocation, 'game');
        if (!gameFolderExists) {
            return { success: false, message: 'Minecraft Launcher has been found, but it has not been run yet.' };
        }
        return { success: true };
    }

    /* Minecraft */
    checkMinecraftFolder(): { success: boolean, message?: string } {
        const folderExists = this.system.fs.existsSync(this.defaultMinecraftFolder);
        if (!folderExists) {
            return { success: false, message: 'No Minecraft folder found. Did you run Minecraft Launcher and login?' };
        }

        const versionsFolder = this.file.existsDirectory(this.defaultMinecraftFolder, 'versions');
        if (!versionsFolder) {
            return { success: false, message: 'Minecraft folder found, but it looks like Minecraft Launcher has not been run' };
        }

        const librariesFolder = this.file.existsDirectory(this.defaultMinecraftFolder, 'libraries');
        if (!librariesFolder) {
            return { success: false, message: 'Minecraft folder found, but no library found. Did you hit the play button in the launcher yet?' };
        }

        return { success: true };
    }

    /* Forge */
    installForgeLibraries() {
        return this.system.fs.copy(this.electron.path.join(this.appDirectory, 'downloads', 'forge'), this.defaultMinecraftLibrary);
    }

    installLauncher(forgeInstance: ForgeInstance) {
        // Mods Folder
        this.system.fs.ensureDirSync(this.electron.path.join(this.defaultMinecraftFolder, 'mods'));

        // Versions Folder
        const fromJarPath = this.electron.path.join(this.appDirectory, 'downloads', 'forge', forgeInstance.name + '.jar');
        const toJarPath = this.electron.path.join(this.defaultMinecraftFolder, 'versions', 'citrus-launcher', forgeInstance.name + '.jar');
        this.system.fs.ensureFileSync(toJarPath);
        this.system.fs.copySync(fromJarPath, toJarPath);

        const profilePath = this.electron.path.join(this.defaultMinecraftFolder, 'versions', 'citrus-launcher', forgeInstance.name + '.json');
        this.system.fs.ensureFileSync(profilePath);
        this.system.fs.writeJsonSync(profilePath, forgeInstance.installProfileObj);
        return true;
    }
}