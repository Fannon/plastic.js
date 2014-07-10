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
            devdocs: [
                'www/devdocs/*'
            ],
            doc: [
                'www/docs/*'
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
                    'bower_components/tv4/tv4.js',
                    'bower_components/rgrove-lazyload/lazyload.js',
                    'src/main.js',
                    'src/options.js',
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
            site: {
                files: [

                ]
            },
            docs: {
                files: [
                    {
                        src: ['dist/plastic.min.js'],
                        dest: 'www/docs/_static/js/plastic.min.js'
                    },
                    {
                        src: ['dist/plastic.js'],
                        dest: 'www/docs/_static/js/plastic.js'
                    },
                    {
                        src: ['dist/plastic.min.css'],
                        dest: 'www/docs/_static/css/plastic.min.css'
                    },
                    {
                        src: ['dist/plastic.css'],
                        dest: 'www/docs/_static/css/plastic.css'
                    }
                ]
            }
        },

        compress: {
            dist: {
                options: {
                    archive: 'www/plasticjs.zip',
                    pretty: true
                },
                files: [
                    {src: ['dist/*'], filter: 'isFile'}
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
                files: 'www/docs/**/*.*',
                tasks: ['shell:sphinx']
            },
            livereload: {
                files: ['src/**/*.js', 'test/**/*.*', 'www/**/*.*'],
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
                    destination : 'www/devdocs',
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
            schemaDocs: {
                command: [
                    'cd src-nodejs',
                    'node generate-descriptions.js',
                    'cd ..'
                ].join('&&')
            },
            sphinx: {
                command: [
                    'sphinx-build -b html src-docs www/docs'
                ].join('&&')
            },
            sphinxForce: {
                command: [
                    'sphinx-build -a -b html src-docs www/docs'
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
            zip: {
                text: "\n###################################################\n### ZIPPING PROJECT \n###################################################"
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
        'shell:schemaDocs',
        'content:sphinx', 'shell:sphinxForce',
        'content:done'
    ]);

    grunt.registerTask('devdocs', [
        'content:copy', 'copy:docs', 'copy:site',
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
        'content:zip', 'compress',
        'docs',
        'devdocs',
        'content:done'
    ]);
};
