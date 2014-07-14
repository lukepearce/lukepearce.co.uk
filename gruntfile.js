module.exports = function(grunt) {

    // 1. Loads all task files from node-modules
    require('load-grunt-tasks')(grunt);

    // 2. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default',
      ['watch']
    ); // My default task is 'watch', it's the only task I want to run when coming back into a project by default

    grunt.registerTask('start',
      ['images',
       'concat',
       'uglify',
       'sass',
       'autoprefixer',
       'remfallback',
       'csso',
       'server']
    );  // My 'start' task is run when starting a new project to build initial stylesheets and script files

    grunt.registerTask('styles', ['sass', 'autoprefixer', 'remfallback', 'csso']);
    grunt.registerTask('images', ['svgmin', 'svg2png', 'imagemin']);
    grunt.registerTask('server', ['clean', 'server']);


    // 3. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Minify SVGs
        svgmin: {
          options: {
            plugins: [{
                removeViewBox: false
            }],
          },
          dist: {
            files: [{
              expand: true,
              cwd: '_themes/<%= pkg.name %>/img/src',
              src: ['**/*.svg'],
              dest: '_themes/<%= pkg.name %>/img/',
              ext: '.min.svg'
            }],
          },
        },

        // Make PNG copies of src SVGs
        svg2png: {
          all: {
            files: [
                { src: ['_themes/<%= pkg.name %>/img/src/**/*.svg'], dest: '_themes/<%= pkg.name %>/img/' },
            ],
          },
        },

        // Make all our JPEG's, PNG's and GIF's smaller
        imagemin: {
          compress: {
              options: {
                  optimizationLevel: 7
              },
              files: [{
                  expand: true,
                  cwd: '_themes/<%= pkg.name %>/img/src',
                  src: '{,*/}*.{png,jpg,jpeg}',
                  dest: '_themes/<%= pkg.name %>/img'
              }]
          }
        },

        // Adds all scripts into one file
        concat: {
            // Script that loads just before close of <body> tag
            footer: {
                src: [
                    '_themes/<%= pkg.name %>/js/global.js',  // This specific file
                    '_themes/<%= pkg.name %>/js/libs/*.js' // All JS in the libs folder
                ],
                dest: '_themes/<%= pkg.name %>/js/script.js',
            },

            // Script that loads in the <head>
            head: {
                src: [
                    '_themes/<%= pkg.name %>/js/global-head.js',  // This specific file
                    '_themes/<%= pkg.name %>/js/libs-head/*.js' // All JS in the libs folder
                ],
                dest: '_themes/<%= pkg.name %>/js/script-head.js',
            },
        },

        // Minify our newly created script.js files
        uglify: {
            footer: {
                src: '_themes/<%= pkg.name %>/js/script.js', // Kept as a file for reference
                dest: '_themes/<%= pkg.name %>/js/script.min.js'
            },

            head: {
                src: '_themes/<%= pkg.name %>/js/script-head.js', // Kept as a file for reference
                dest: '_themes/<%= pkg.name %>/js/script-head.min.js'
            }
        },

        // Compile CSS file from Sass files
        sass: {
          dist: {
            options: {
              compass: true,
              lineNumbers: true,
            //  noCache: true // There were errors when using sass-cache so disabled
            },
            files: {
              '_themes/<%= pkg.name %>/css/style.css': ['_themes/<%= pkg.name %>/sass/style.scss'],
              '_themes/<%= pkg.name %>/css/style-ie.css': ['_themes/<%= pkg.name %>/sass/style-ie.scss']
            }
          }
        },

        // Auto-prefix CSS properties using Can I Use?
        autoprefixer: {
          options: {
            browsers: ['last 2 versions', 'ie 8', 'android 3']
          },
          // No new file being made, modifies existing css file
          no_dest: {
            src: '_themes/<%= pkg.name %>/css/style.css'
          },
        },

        // Add rem px fallbacks
        remfallback: {
          options: {
            log: true,
            replace: false,
          },
          your_target: {
            files: {
              '_themes/<%= pkg.name %>/css/style.css': ['_themes/<%= pkg.name %>/css/style.css']
            },
          },
        },

        // Minify our prefixed and rem fallback'ed css file
        csso: {
          dist: {
            files: {
              // Unminified file kept as a reference or to use in development
              '_themes/<%= pkg.name %>/css/style.min.css': ['_themes/<%= pkg.name %>/css/style.css'],
            },
          },
        },

        // Start a PHP server (don't use alongside MAMP)
        php: {
            options: {
                hostname: '0.0.0.0', // Change back to localhost if not viewing from other devices
                port: 9000,
                open: true // Automatically opens a browser window to server
            },
            watch: {} // Required to use grunt-contrib-watch
        },

        // 4. Watch our working files for changes then execute certain tasks and reload the browser
        watch: {
            options: {
                livereload: true,
            },

            scripts: {
                files: ['_themes/<%= pkg.name %>/js/**/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },

            css: {
                files: ['_themes/<%= pkg.name %>/**/*.scss'],
                tasks: ['sass', 'autoprefixer', 'remfallback', 'csso'],
            },

            svg: {
                files: ['_themes/<%= pkg.name %>/img/src/**'],
                tasks: ['svgmin', 'svg2png'],
            },

            // Refreshes browser when html modified
            html: {
                files: [
                '_themes/<%= pkg.name %>/templates/**',
                '_themes/<%= pkg.name %>/layouts/**',
                '_themes/<%= pkg.name %>/partials/**'],
            },

            // Refreshes browser when content files modified
            markdown: {
                files: ['_content/**'],
            }

        },

        // Flushes cache but leaves folder intact
        clean: {
          dev: {
            src: ["_cache/**", "!_cache"]
          }
        },

    });

};
