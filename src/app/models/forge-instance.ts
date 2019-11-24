import { ForgeVersion } from './forge-version';

export class ForgeInstance {
    id: number;
    gameVersionId: number;
    minecraftGameVersionId: number;
    forgeVersion: string;
    name: string;
    type: number;
    downloadUrl: string;
    filename: string;
    installMethod: number;
    latest: boolean;
    recommended: boolean;
    dateModified: string; // Date time
    mavenVersionString: string;
    versionJson: string;
    librariesInstallLocation: string;
    minecraftVersion: string;
    additionalFilesJson: string;
    modLoaderGameVersionId: number;
    modLoaderGameVersionTypeId: number;
    modLoaderGameVersionTypeStatus: number;
    mcGameVersionId: number;
    mcGameVersionStatus: number;
    mcGameVersionTypeStatus: number;
    installProfileJson: string;

    // Custom
    dateModifiedDate: Date; 
    versionObj: ForgeVersion;
    installProfileObj: Object;

    constructor(obj: Object) {
        Object.keys(obj).forEach(key => {
            this[key] = obj[key];
        });

        this.dateModifiedDate = new Date(this.dateModified);
        this.versionObj = JSON.parse(this.versionJson);
        this.installProfileObj = JSON.parse(this.installProfileJson);
    }
}
