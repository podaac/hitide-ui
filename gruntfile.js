module.exports = function(grunt) {

    grunt.initConfig({
        //read in the package file to use the attributes
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            prebuild: ["./dist", "./docs"],
            postbuild: ["./dist/**/*.js.consoleStripped.js", "./dist/**/*.js.uncompressed.js"]
        },

        uglify: {
            build: {
                src: "./src/index.js",
                dest: "./dist/index.js"
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'src/index.html'
                }
            }
        },

        replace: {
            postbuild: {
                src: ['dist/jpl/dijit/templates/HelpDialog.html'],
                overwrite: true,
                replacements: [{
                    from: '@@VERSION',
                    to: "<%= pkg.version %>"
                }]
            }
        },

        dojo: {
            dist: {
                options: {
                    dojo: '../../dojo/dojo.js', // Path to dojo.js file in dojo source
                    load: 'build', // Optional: Utility to bootstrap (Default: 'build')
                    profile: '../../../profiles/build.profile.js', // Profile for build
                    require: '../../../src/app/run.js', // Optional: Module to require for the build (Default: nothing)
                    releaseDir: '../dist', // Directory to output build
                    cwd: 'src/util/buildscripts' // Directory to execute build within
                }
            }
        }

    });

    //load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-dojo');

    //register tasks
    grunt.registerTask('default', [
        'clean:prebuild',
        'dojo',
        'htmlmin',
        'replace:postbuild',
        // 'uglify',
        'clean:postbuild'
    ]);
};
