module.exports = function (grunt) {
    jsOutputName = "bundle.js";
    bundleLocation = `build/${grunt.option("build")}/${jsOutputName}`;
    electronVersion = "1.3.5";

    browserifyOptionDict = {
        debug: grunt.option("build").includes("dev") ? true : false,
    };

    copyFiles = [];
    if (grunt.option("build").includes("electron")) {
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
            development: {
                src: `main-native.js`,
                dest: bundleLocation,
                options: {
                    browserifyOptions: browserifyOptionDict,
                    transform: [["babelify", { "presets": ["@babel/preset-env"] }]],
                }
            },
        },
        uglify: {
            options: {
                banner: "// Copyright ProgrammingIncluded"
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
            files: ["src/**/*.js", `main-${grunt.option("build")}.js`],
            tasks: ["browserify"]
        },
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-electron');
    grunt.loadNpmTasks('grunt-contrib-watch');

    let defaultTask = ["browserify", "copy"];
    if(!grunt.option("build").includes("dev")) {
        defaultTask.push("uglify");
    }
    else {
        defaultTask.push("watch")
    }

    if(grunt.option("build").includes("electron")) {
        defaultTask.push("electron");
    }

    grunt.registerTask("default", defaultTask);
};
