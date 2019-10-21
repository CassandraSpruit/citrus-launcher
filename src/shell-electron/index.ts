import { menuTemplate } from './menu';

import { app, BrowserWindow, Menu, ipcMain, dialog, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

function createMainWindow() {
    let win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL(url.format({
        // pathname: path.join(__dirname, 'index.html'),
        pathname: path.join(__dirname, '../../dist/index.html'),
        protocol: 'file',
        slashes: true
    }));

    win.on('closed', () => {
        win = null;
    });

    ipcMain.on('save-dialog', (event, arg) => {
        const filter = (arg && arg.type === 'csv') ?
            { name: 'Comma Separated Value', extensions: ['csv'] } :
            { name: 'Excel', extensions: ['xlsx'] };
    
        dialog.showSaveDialog({ filters: [filter], defaultPath: arg.defaultPath }).then(val => {
            if (val.canceled) return;
            event.reply('save-dialog-reply', arg, val.filePath);
        });
    });

    ipcMain.on('open-file', (event, arg) => {
        if (!arg) return;
        shell.openItem(arg);
    });

    ipcMain.on('show-message', (event, arg) => {
        dialog.showMessageBox(win, {
            type: 'question',
            buttons: arg.buttons,
            message: arg.question
        }).then(val => {
            // User clicked cancel
            if (val.response === 0) return;
            event.reply('show-message-reply', val);
        });
    });

    // Create Menu
    let menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

process.on('uncaughtException', (err: Error) => {
    console.log('Critical failure!', err);
    fs.writeFileSync('crash.log', err + '\n' + err.stack);

    app.relaunch();
    app.exit(0);
});
process.on('SIGTERM', () => {
    console.log('Mega critical failure!');
});

// Init here
app.on('ready', createMainWindow);
