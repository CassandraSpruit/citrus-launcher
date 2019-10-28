import { WriteStream } from 'fs';
import { FileService } from './file';
import { Service } from '@cspruit/vivi/models';
import { ElectronService } from './electron';

export class FileStoreService extends Service {
    directory: string;
    openFiles: Map<string, WriteStream> = new Map<string, WriteStream>();

    constructor(
        private electron: ElectronService,
        private file: FileService
    ) {
        super();
        this.directory = electron.remote.app.getPath('userData');
    }

    read<T>(fileName: string, type?: { new(...data: any): T }): T | Array<T> {
        const string = this.file.read(this.directory, fileName);
        try {
            const data = JSON.parse(string);
            if (!data) {
                return data;
            }
            if (type) {
                if (data instanceof Array) {
                    return data.map(obj => new type(...Object.values(obj)));
                }
                return new type(...Object.values(data));
            }
            return data;
        } catch (e) {
            return null;
        }
    }

    write(fileName: string, data: any): void {
        this.file.write(this.directory, fileName, data);
    }

    append(fileName: string, data: any): void {
        const stream = this.openFiles.get(fileName);
        if (stream) {
            this.writeStream(stream, data);
        } else {
            this.startMultiWrite(fileName, data);
        }
    }

    closeFile(fileName: string): void {
        if (!this.electron.isElectron()) return;
        const stream = this.openFiles.get(fileName);

        if (!stream) { return; }

        (<WriteStream>stream).close();
    }

    private startMultiWrite(fileName: string, data?: any) {
        const stream = this.file.startMultiWrite(this.directory, fileName, data);
        this.openFiles.set(fileName, <WriteStream>stream);
    }

    private writeStream(stream: WriteStream, data: any) {
        this.file.writeToStream(stream, data);
    }
}
