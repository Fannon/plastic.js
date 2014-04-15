/* global module, require */

module.exports = function (grunt) {
    'use strict';

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time at the end
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({

        /** Get Metadata from Bower package.json */
        pkg: grunt.file.readJSON('package.json'),

        /** Production JavaScript Header Comment */
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed MIT */\n',

        /** Cleaning up old files / directories */
        clean: {
            files: ['dist']
        },

        /** Concatnation of multiple files into a single one */
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: [
                    'src/main.js',
                    'src/options.js',
                    'src/dataParser/**/*.js',
                    'src/display/**/*.js',
                    'src/helper/**/*.js'
                ],
                dest: 'dist/plastic.js'
            }
        },

        /** JavaScript Minification */
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: 'dist/plastic.js',
                dest: 'dist/plastic.min.js'
            }
        },

        /** QUnit Unit Testing */
//        qunit: {
//            all: {
//                options: {
//                    timeout: 5000,
//                    urls: ['http://localhost:9000/test/index.html']
//                }
//            }
//        },

        /** JavaScript Linting */
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['Gruntfile.js']
            },
            src: {
                options: {
                    jshintrc: 'src/.jshintrc'
                },
                src: ['src/**/*.js']
            },
            test: {
                options: {
                    jshintrc: 'demo/spec/.jshintrc'
                },
                src: ['demo/spec/**/*.js']
            }
        },

        /** Compare Sizes of built Library */
        sizediff: {
            dist: {
                options: {
                    target: 'master' // branch
                },
                src: [
                    'dist/plastic.js',
                    'dist/plastic.min.js'
                ]
            }
        },

        /** Copies Files */
        copy: {
            demo: {
                files: [{
                    src: ['bower_components/d3/d3.min.js'],
                    dest: 'demo/lib/d3.min.js'
                }, {
                    src: ['bower_components/jquery/dist/jquery.min.js'],
                    dest: 'demo/lib/jquery.min.js'
                }, {
                    src: ['bower_components/foundation/css/foundation.min.css'],
                    dest: 'demo/lib/foundation.min.css'
                }]
            }
        },

        /** Watches for Filesystem Changes and triggers specific tasks */
        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: 'src/**/*.*',
                tasks: ['jshint:src', 'concat']
            },
//            demo: {
//                files: 'demo/**/*.*',
//                tasks: ['jshint:src']
//            },
//            test: {
//                files: 'test/**/*.*',
//                tasks: ['jshint:test', 'qunit']
//            },
            livereload: {
                files: ['dist/**/*.js', 'demo/**/*.*'],
                options: {
                    livereload: true
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        /** Creates a localhost webserver */
        connect: {
            server: {
                options: {
                    port: 9000,
                    livereload: true
                }
            }
        },

        /** Puts some more Infos to the console */
        content: {
            options: {
                newLineAfter: false,
                gruntLogHeader: false
            },
            test: {
                text: "\n###################################################\n### RUNNING UNIT TESTS\n###################################################"
            },
            jshint: {
                text: "\n###################################################\n### LINTING JAVASCRIPT\n###################################################"
            },
            concat: {
                text: "\n###################################################\n### CONCATNATING JAVASCRIPT\n###################################################"
            },
            clean: {
                text: "\n###################################################\n### CLEANING OLD FILES\n###################################################"
            },
            uglify: {
                text: "\n###################################################\n### MINIFY JAVASCRIPT\n###################################################"
            },
            sizediff: {
                text: "\n###################################################\n### COMPARING NEW SIZE\n###################################################"
            },
            connect: {
                text: "\n###################################################\n### STARTING LOCALHOST WEBSERVER\n###################################################"
            },
            copy: {
                text: "\n###################################################\n### COPYING FILES\n###################################################"
            },
            done: {
                text: "\n###################################################\n### GRUNT COMPLETED \n###################################################"
            }
        }
    });

    grunt.registerTask('default', [
        'connect',
        'watch'
    ]);

    grunt.registerTask('test', [
        'content:connect', 'connect',
        'content:concat', 'concat',
        'content:jshint', 'jshint'
//        'content:test', 'qunit'
    ]);

    grunt.registerTask('build', [
        'test',
        'content:clean', 'clean',
        'content:concat', 'concat',
        'content:uglify', 'uglify',
        'content:sizediff', 'sizediff',
        'content:copy', 'copy:demo',
        'content:done'
    ]);
};
