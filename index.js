
const ELECTRON = require("electron");

const {app, ipcMain, BrowserWindow} = require("electron");

let win;

ipcMain.on("writeFile", function(event, data) {
    console.log(data);
});

app.on("ready", function() {
    let options = {
        width : 1280,
        height : 720,
        frame : true,
        icon : "images/seed.png",
        resizable : true,
        maximizable : true
    };
    
    win = new BrowserWindow(options);
    
    win.loadFile("test.html");
    
    win.on("closed", function() {
        win = null;
    });
});
