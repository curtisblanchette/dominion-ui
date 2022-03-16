'use strict';
/* eslint-env browser */
if (window && window.process && window.process.versions['electron']) {
    const { remote } = require('electron');
    const updater = remote.require('electron-simple-updater');
    const Menu = remote.Menu;
    const Tray = remote.Tray;
    const nativeImage = remote.nativeImage;
    const globalShortcut = remote.globalShortcut;
    const ipcRenderer = require('electron').ipcRenderer;
    const path = require('path');
    const settings = require('electron').remote.require('electron-settings');
    var autoLaunch = settings.get('autoLaunch');

    let tray;

    //once the app is focused again, the main process will notify the renderer to re-create the keyboard bindings
    ipcRenderer.on('app_focused', handleShortcuts);

    //right-click menu
    const contextMenu = Menu.buildFromTemplate([{
        label: 'Copy', role: 'copy'
    }, {
        label: 'Paste', role: 'paste'
    }, {
        label: 'Cut', role: 'cut'
    }]);

    window.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        contextMenu.popup();
    });

    attachUpdaterHandlers();
    handlePushNotifications();
    handleShortcuts();
    createTrayIcon();

    function attachUpdaterHandlers() {
        updater.on('update-available', onUpdateAvailable);
        updater.on('update-downloaded', onUpdateDownloaded);

        function onUpdateAvailable(meta) {
            window.alert('Version ' + meta.version + ' is available! We will let you know as soon as it is ready. Keep on using the application normally.');
        }

        function onUpdateDownloaded() {
            if (window.confirm('The app has been updated. Do you like to restart it now?')) {
                updater.quitAndInstall();
            }
        }

        updater.on('error', function (err) {
            window.alert(JSON.stringify(err));
        });
    }

    function handlePushNotifications() {
        Notification.requestPermission().then(function (result) {
            self.addEventListener('electronPush', function (event) {
                let pushNotification = new Notification('4iiz Notification', {
                    body: event.detail.message,
                    icon: process.platform == "darwin" ? '' : 'https://s3.amazonaws.com/4iiz-assets/electron/icon.png'
                });

                pushNotification.onclick = () => {
                    //we can do this as we always use just 1 window
                    remote.BrowserWindow.getAllWindows()[0].focus();
                    remote.BrowserWindow.getAllWindows()[0].maximize();
                    window.dispatchEvent(new CustomEvent('push_clicked', { detail: event.detail }));
                };
            });
        });
    }

    function handleShortcuts() {
        globalShortcut.register('CmdOrCtrl+V', () => {
            document.execCommand('Paste');
        });

        globalShortcut.register('CmdOrCtrl+C', () => {
            document.execCommand('Copy');
        });

        globalShortcut.register('CmdOrCtrl+X', () => {
            document.execCommand('Cut');
        });

        globalShortcut.register('CmdOrCtrl+A', () => {
            document.execCommand('SelectAll');
        });

        globalShortcut.register('CmdOrCtrl+Z', () => {
            document.execCommand('Undo');
        });

        globalShortcut.register('Shift+CmdOrCtrl+Z', () => {
            document.execCommand('Redo');
        });

        globalShortcut.register('Cmd+Q', () => {
            ipcRenderer.send('quit_app');
        });
    }

    function createTrayIcon() {
        const nimage = nativeImage.createFromPath(path.join(__dirname, process.platform == "darwin" ? 'IconTemplate.png' : "WinIconTemplate.png"));
        tray = new Tray(nimage);

        var contextMenu = Menu.buildFromTemplate([
            {
                label: 'Open', click: function () {
                    ipcRenderer.send('open_app');
                }
            }, {
                label: 'Launch on startup', type: 'checkbox', checked: (autoLaunch === true || autoLaunch == undefined), click: function (item) {
                    if (!item.checked) {
                        settings.set('autoLaunch', false);
                        setAutoLaunch(false);
                    } else {
                        settings.set('autoLaunch', true);
                        setAutoLaunch(true);
                    }
                }
            }, {
                label: "Edit",
                submenu: [
                    { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
                    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
                    { type: "separator" },
                    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
                    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
                ]
            }, {
                label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: function () {
                    ipcRenderer.send('quit_app');
                }
            }
        ]);

        tray.setContextMenu(contextMenu);

        if (autoLaunch === true || autoLaunch == undefined) {
            setAutoLaunch(true);
        } else if (autoLaunch === false) {
            setAutoLaunch(false);
        }
    }

    function setAutoLaunch(autoLaunch) {
        ipcRenderer.send('setAutoLaunch', { autoLaunch });
    }
}