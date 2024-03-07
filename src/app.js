const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // mainWindow.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, "..", `/www/index.html`),
  //     protocol: "file:",
  //     slashes: true,
  //   })
  // );

  mainWindow.webContents.openDevTools();

  mainWindow.loadURL("http://192.168.0.119:4200/");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
