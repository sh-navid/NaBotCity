/*[src/main.js]*/
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 500,
    frame: true,
    transparent: true,
    backgroundColor: "#00000000",
    icon: path.join(__dirname, 'assets/logo192.png'), // Add the path to your logo here
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL("http://localhost:4411");

  // Add an event listener for the Escape key
  win.webContents.on("did-finish-load", () => {
    win.webContents.executeJavaScript(`
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          window.close(); // Close the window
        }
      });
    `);
  });
}

// Application lifecycle events
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
