/* global module, require */

module.exports = function (grunt) {
    'use strict';

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time at the end
    require('time-grunt')(grunt);

    // Project configuration.4
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
            js: {
                src: [
                    'src/main.js',
                    'bower_components/yepnope/yepnope.js',
                    'src/options.js',
                    'src/core/**/*.js',
                    'src/dataParser/**/*.js',
                    'src/queryParser/**/*.js',
                    'src/schemaParser/**/*.js',
                    'src/display/**/*.js',
                    'src/helper/**/*.js'
                ],
                dest: 'dist/plastic.js'
            },
            css: {
                src: [
                    'src/main.css',
                    'src/modules/display/*.css'
                ],
                dest: 'dist/plastic.css'
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

        cssmin: {
            add_banner: {
                files: {
                    'dist/plastic.min.css': ['dist/plastic.css']
                }
            }
        },

        /** JavaScript Linting */
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                force: false
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
                    jshintrc: 'test/spec/.jshintrc'
                },
                src: ['test/spec/**/*.js']
            }
        },

        /** Compare Sizes of built Library */
        sizediff: {
            js: {
                options: {
                    target: 'master' // branch
                },
                src: [
                    'dist/plastic.js',
                    'dist/plastic.min.js'
                ]
            },
            css: {
                options: {
                    target: 'master' // branch
                },
                src: [
                    'dist/plastic.css',
                    'dist/plastic.min.css'
                ]
            }
        },

        /** Copies Files */
        copy: {
            documentation: {
                files: [{
                    src: ['bower_components/d3/d3.min.js'],
                    dest: 'docs/lib/d3.min.js'
                }, {
                    src: ['bower_components/jquery/dist/jquery.min.js'],
                    dest: 'docs/lib/jquery.min.js'
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
//                tasks: ['jshint:src', 'concat']
                tasks: ['concat']
            },
            livereload: {
                files: ['src/**/*.js', 'test/**/*.*'],
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

        jsdoc : {
            api : {
                src : ['src/**/**.js', 'README.md'],
                options : {
                    destination : 'docs/api',
                    template : "bower_components/jaguarjs-jsdoc",
                    configure : "jsdoc.conf.json"
                }
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
            cssmin: {
                text: "\n###################################################\n### MINIFY CSS\n###################################################"
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
    ]);

    grunt.registerTask('build', [
        'test',
        'content:clean', 'clean',
        'content:concat', 'concat',
        'content:uglify', 'uglify',
        'content:cssmin', 'cssmin',
        'content:sizediff', 'sizediff',
        'content:copy', 'copy:documentation',
        'content:done'
    ]);
};
