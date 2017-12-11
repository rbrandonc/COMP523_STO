# Dev
Do:

Go to /ProjectFolder/Server/

Before running for the first time you will have to run ```npm install``` to install all node dependencies.

In terminal:

```npm start```

A window with the 3 screens will open automatically. To have one screen on each browser window you can just go into the project folder and open each screens .html file under it corresponding folder.

# Production

Do:

```npm run build```

Binaries for mac, windows, and linux will be placed in the /bin folder. To run in windows, simply double click the .exe. To run in mac or linux, first navigate to the bin/ folder and run ```chmod +x filename``` on the corresponding binary for your OS before double clicking.

*Note you will need to ```npm install -g dependency``` any dependencies used in the build script, viewable in package.json.
