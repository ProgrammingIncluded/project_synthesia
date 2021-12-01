# Project Synthesia

Submission for Game Off 2021. More info to come.

## Build Instructions

Install node packages for development:

```bash
npm install
```

Then build either native (HTML5 version) or (electron):

```bash
npm run release-native # html5-only
npm run release-electron # electron-only
npm run release # both
```

Note that electron will build across Win32, MacOS, and Linux all at once.
Modify `Gruntfile.js` to target specific platforms.

### Running Native Build (HTML5; recommended)

The best way to run the application is through your browser via a server.
This provides the least overhead to the application and runs natively.
Type the following to start a local `http` server which can emulate a real server instance:

```
npm run native
```

This will generate a local server to open. Then open `main.html` in order to understand more.

### Running Electron Build

Electron builds will be generated under: `build/electron/out/*` where builds are separated by folders.
Those files can be packaged as-is.
