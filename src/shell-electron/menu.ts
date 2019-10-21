import { MenuItemConstructorOptions, MenuItem } from 'electron';

export const menuTemplate: Array<MenuItemConstructorOptions | MenuItem> = [
    {
        label: 'Window',
        submenu: [
            { role: 'minimize'},
            { role: 'close' },
            { role: 'quit'}
        ]
    },
    {
        label: 'Navigate',
        submenu: [
            { role: 'reload' }
        ]
    },
    {
        label: 'Dev',
        submenu: [
            { role: 'toggleDevTools' }
        ]
    }
];