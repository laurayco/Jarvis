const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Jarvis = require("./jarvis.js");

electron.crashReporter.start();

var mainWindow = null;

app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  var jarvis = new Jarvis.ServiceRegistry();
  jarvis.init(function(){
    console.log("Hello, sir.");
    jarvis.connect_service("Demo Service",200);
  });
});
