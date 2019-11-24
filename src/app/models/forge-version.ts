export interface ForgeVersion {
    id: string;
    time: string; // Datetime stamp
    minimumLauncherVersion: number;
    inheritsFrom: string; // Mc Version
    jar: string; // Forge jar version
    libraries: Array<ForgeLibrary>;
    mainClass: string; // ???
    arguments: {
        game: Array<string>; // Game arguements
    }
}

export interface ForgeLibrary {
    name: string;
    downloads: {
        artifact: {
            path: string; // Where it goes relative to .minecraft/libaries folder
            url: string;
            sha1: string;
            size: number;
        }
    }
}