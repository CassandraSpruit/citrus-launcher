import { WriteStream } from 'fs';
import { Observable, AsyncSubject } from 'rxjs';
import { Service } from '@cspruit/vivi';
import { SystemService } from './system';
import { ElectronService } from './electron';

export class FileService extends Service {
    constructor(
        private system: SystemService
    ) {
        super();
    }

    /*** Read File ***/
    readAsync(appPath: string, fileName: string, extension: string = '.json'): Observable<string> {
        const async = new AsyncSubject<string>();
        this.readAsyncElectron(async, appPath, fileName, extension);
        return async.asObservable();
    }

    private readAsyncElectron(async: AsyncSubject<string>, appPath: string, fileName: string, extension: string = '.json') {
        const path = this.system.path.join(appPath, fileName + extension);
        // TODO: Utf doesn't work for non-json file
        this.system.fs.readFile(path, 'utf8', (error, data) => {
            if (error) {
                async.error(error);
            } else {
                async.next(data);
            }
            async.complete();
        });
    }

    /// DEPRECATED USE ASYNC INSTEAD
    read(appPath: string, fileName: string, extension: string = '.json'): string {
        // TODO: Utf doesn't work for non-json files
        const path = this.system.path.join(appPath, fileName + extension);
        try {
            return this.system.fs.readFileSync(path, 'utf8');
        } catch (e) {
            return null;
        }
    }

    /// Deprecated USE ASYNC INSTEAD
    write(appPath: string, fileName: string, data: any, extension: string = '.json'): void {
        // TODO: Handle non-json
        const path = this.system.path.join(appPath, fileName + extension);
        this.system.fs.writeFileSync(path, JSON.stringify(data), 'utf8');
    }

    /*** Write File ***/
    writeAsync(appPath: string, fileName: string, data: any, extension: string = '.json'): Observable<void> {
        const async = new AsyncSubject<void>();
        this.writeAsyncElectron(async, appPath, fileName, data, extension);

        return async.asObservable();
    }

    private writeAsyncElectron(async: AsyncSubject<void>, appPath: string, fileName: string, data: any, extension: string) {
        const path = this.system.path.join(appPath, fileName + extension);

        // TODO: Handle non-json
        this.system.fs.writeFile(path, JSON.stringify(data), 'utf8', (error) => this.electronErrorHandling(error, async));
    }

    // For files that have multiple writes
    startMultiWrite(appPath: string, fileName: string, data?: any, extension: string = '.json'): WriteStream {
        return this.startMultiWriteElectron(appPath, fileName, data, extension);
    }

    private startMultiWriteElectron(appPath: string, fileName: string, data: any, extension: string): WriteStream {
        const path = this.system.path.join(appPath, fileName + extension);
        const stream = this.system.fs.createWriteStream(path, { flags: 'a' });
        if (data) {
            stream.write(JSON.stringify(data));
        }

        return stream;
    }

    writeToStream(stream: WriteStream, data: any) {
        // Conviently writestream and filewriter have roughly the same write fn
        stream.write(JSON.stringify(data));
    }

    /*** Get/Create Directory ***/
    createDirectoryAsync(dirPath: string, newDir?: string): Observable<void> {
        const async = new AsyncSubject<void>();
        this.createDirectoryElectron(async, dirPath, newDir);
        return async.asObservable();
    }

    private createDirectoryElectron(async: AsyncSubject<void>, dirPath: string, newDir: string) {
        this.system.fs.mkdir(this.system.path.join(dirPath, newDir), (error) => this.electronErrorHandling(error, async));
    }

    // TODO: Determine if existsDirectory/existsFile is really needed
    existsDirectory(dirPath, dir: string) {
        return this.system.fs.existsSync(this.system.path.join(dirPath, dir));
    }

    existsFile(appPath: string, fileName: string, extension: string = '.json'): boolean {
        return this.system.fs.existsSync(this.system.path.join(appPath, fileName + extension));
    }

    /*** Generic Handling ***/
    private electronErrorHandling(error: any, async: AsyncSubject<any>) {
        if (error) {
            async.error(error);
        } else {
            async.next(null);
        }
        async.complete();
    }
}