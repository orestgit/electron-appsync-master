// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const DataStore = require("@aws-amplify/datastore");
const Amplify = require("@aws-amplify/core");
const awsExports = require("./src/aws-exports");
Amplify.Amplify.configure(awsExports.awsmobile);
const Post = require("./src/models/index");
function save() { //saves data to DataStore and Syncs with DynamoDB
  return new Promise((resolve, reject) => {
    try {
      const saveResults = DataStore.DataStore.save(
        new Post.Post({
          title: "My First Post",
          rating: 10,
          status: Post.PostStatus.PUBLISHED,
        })
      );

      resolve(saveResults);
    } catch (error) {
      console.log(error);
      reject("something went wrong");
    }
  });
}
function query() { //retrieves data to DataStore and Syncs with DynamoDB
  return new Promise((resolve, reject) => {
    try {
      const posts = DataStore.DataStore.query(Post.Post, (c) =>
        c.rating("gt", 9)
      );
      resolve(posts);
    } catch (error) {
      console.log(error);
      reject("something went wrong");
    }
  });
}
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  save().then((item) => {
    console.log(item);
    console.log("Post saved successfully!");
    save().then((item2) => {
      console.log(item2);
      console.log("Post saved successfully!");
      query().then((results) => {
        console.log(results);
      });
    });
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
