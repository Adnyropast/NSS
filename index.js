
const ELECTRON = require("electron");

const {app, ipcMain, BrowserWindow} = require("electron");

let win;

app.on("ready", function() {
    let options = {
        width : 1280,
        height : 720,
        frame : true,
        icon : "images/seed.png",
        resizable : true,
        maximizable : true,
        webPreferences : {
            nodeIntegration : true
        }
    };
    
    win = new BrowserWindow(options);
    
    win.loadFile("test.html");
    
    win.on("closed", function() {
        win = null;
    });
});
