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
            dist: [
                'dist/*'
            ],
            apidoc: [
                'docs/api/*'
            ],
            sphinx: [
                'docs/dicst/*'
            ]
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
                    'src/options.js',
                    'bower_components/rgrove-lazyload/lazyload.js',
                    'bower_components/tv4/tv4.js',
                    'src/core/*.js',
                    'src/helper/*.js',
                    'src/modules/*.js',
                    'src/modules/data/*.js',
                    'src/modules/display/*.js',
                    'src/modules/query/*.js'
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
            docs: {
                files: [
                    {
                        src: ['bower_components/jquery/dist/jquery.min.js'],
                        dest: 'docs/source/_static/jquery.min.js'
                    },
                    {
                        src: ['dist/plastic.min.js'],
                        dest: 'docs/source/_static/plastic.min.js'
                    },
                    {
                        src: ['dist/plastic.js'],
                        dest: 'docs/source/_static/plastic.js'
                    },
                    {
                        src: ['dist/plastic.min.css'],
                        dest: 'docs/source/_static/plastic.min.css'
                    }
                ]
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
                tasks: ['concat']
            },
            docs: {
                files: 'docs/source/**/*.*',
                tasks: ['shell:sphinx']
            },
            livereload: {
                files: ['src/**/*.js', 'test/**/*.*', 'docs/dist/**/*.*'],
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

        shell: {
            sphinx: {
                command: [
                    'cd docs',
                    'sphinx-build -b html source dist'
                ].join('&&')
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
            jsdoc: {
                text: "\n###################################################\n### GENERATING API DOCUMENTATION\n###################################################"
            },
            sphinx: {
                text: "\n###################################################\n### GENERATING SPHINX DOCUMENTATION\n###################################################"
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

    grunt.registerTask('docs', [
        'content:copy', 'copy:docs',
        'content:sphinx', 'clean:sphinx', 'shell:sphinx',
        'content:jsdoc', 'jsdoc',
        'content:done'
    ]);

    grunt.registerTask('build', [
        'test',
        'content:clean', 'clean:dist',
        'content:concat', 'concat',
        'content:uglify', 'uglify',
        'content:cssmin', 'cssmin',
        'content:sizediff', 'sizediff',
        'content:copy', 'copy',

        'content:done'
    ]);
};
