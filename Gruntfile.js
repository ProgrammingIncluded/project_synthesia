module.exports = function (grunt) {
    jsOutputName = "bundle.js";
    buildFullName = grunt.option("build");
    buildPlatform = buildFullName.split(":").at(-1);
    buildIsDev = buildFullName.includes("dev");
    buildVariant = buildIsDev ? "dev" : "prod";
    bundleLocation = `build/${buildPlatform}/${jsOutputName}`;
    electronVersion = "1.3.5";

    browserifyOptionDict = {
        debug: buildIsDev ? true : false,
    };

    copyFiles = [];
    if (buildFullName.includes("electron")) {
        copyFiles = [
                    {src: ["package.json"], dest: "build/electron/package.json"},
                    {src: ["main-electron.js"], dest: "build/electron/index.js"},
                    {src: ["main.html"], dest: "build/electron/index.html"},
                    {expand: true, src: ["assets/**"], dest: "build/electron"}
                ];
    }
    else {
        copyFiles = [
                    {src: ["main.html"], dest: "build/native/main.html"},
                    {expand: true, src: ["assets/**"], dest: "build/native"},
                ];
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        browserify: {
            build: {
                src: `main-native${buildIsDev ? "-dev" : ""}.js`,
                dest: bundleLocation,
                options: {
                    browserifyOptions: browserifyOptionDict,
                    transform: [["babelify", { "presets": ["@babel/preset-env"] }]],
                }
            }
        },
        uglify: {
            options: {
                banner: "// Copyright ProgrammingIncluded",
                compress: false
            },
            dist: {
                files: JSON.parse(`{"${bundleLocation}":"${bundleLocation}"}`)
            }
        },
        copy: {
            main: {
                files: copyFiles
            }
        },
        electron: {
            winBuild: {
                options: {
                    name: "Synthesia",
                    dir: "build/electron",
                    out: "build/electron/out",
                    version: electronVersion,
                    platform: "win32",
                    arch: "x64",
                    overwrite: true
                }
            }
        },
        watch: {
            files: ["src/**/*.js", `main-${buildPlatform}.js`],
            tasks: ["browserify"]
        },
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-electron');
    grunt.loadNpmTasks('grunt-contrib-watch');

    let defaultTask = ["browserify", "copy"];
    if(!buildFullName.includes("dev")) {
        defaultTask.push("uglify");
    }
    else {
        defaultTask.push("watch")
    }

    if(buildFullName.includes("electron")) {
        defaultTask.push("electron");
    }

    grunt.registerTask("default", defaultTask);
};
