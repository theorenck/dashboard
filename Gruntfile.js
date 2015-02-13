module.exports = function(grunt){

  grunt.initConfig({

    cssmin: {
      options : {
        // keepSpecialComments: 0,
        rebase : false,
      },
      target: {
        files: {
          'public/dist/css/app.min.css': ['public/assets/css/app.css']
        }
      }
    },

    uglify: {
      core: {
        options: {
          sourceMap: true,
          sourceMapName: 'public/dist/sourcemap.map',
          mangle : false,
        },
        files: {
          'public/dist/js/atlas.js': [
            'public/assets/js/app.js',
            'public/assets/js/controller.js',
            'public/assets/js/directive.js',
            'public/assets/js/service.js'
          ]
        }
      },

      helpers: {
        options: {
          mangle : false,
        },
        files: [{
          expand: true,
          cwd: 'public/assets/js/helpers/',
          src: '**/*.js',
          dest: 'public/dist/js/helpers/'
        }]
      },

      plugins: {
        files: [{
          expand: true,
          cwd: 'public/assets/js/plugins/',
          dest: 'public/dist/js/plugins/',
          src : '{,*/}*.js'
        }]
      },

      components: {
        options: {
          mangle : false,
        },
        files: [{
          expand: true,
          cwd: 'public/assets/js/components/',
          src: '{,*/}*.js',
          dest: 'public/dist/js/components/'
        }]
      },
    },

    watch: {
      scripts: {
        files: ['public/assets/**/*.js'],
        tasks: ['uglify:core', 'uglify:helpers', 'uglify:components'],
        options: {
          spawn: false,
        },
      },
      css: {
        files: 'public/assets/**/*.css',
        tasks: ['cssmin'],
      },
      images : {
        files : ["public/assets/**/*.{png,jpg,gif}"],
        tasks : ['imagemin']
      }
    },

    copy: {
      other: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'public/assets/',
          dest: 'public/dist/',
          src: [
            '{,*/}*.{ico,txt,map}',
            '{,*/}*.{webp,gif,svg}',
            'fonts/*.*'
          ]
        }]
      },

      libs: {
        files: [{
          expand: true,
          cwd: 'public/assets/js/libs/',
          dest: 'public/dist/js/libs/',
          src : '{,*/}*.*'
        }]
      }

    },

    clean: {
      dist: {
        files: {src: ['public/dist/**/*']}
      },
    },


    imagemin: {
      prod: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: 'public/assets',
          src: ['{,*/}*.{png,jpg,gif}'],
          dest: 'public/dist'
        }]
      },
    },

  });


  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.registerTask('build', ['clean', 'cssmin', 'uglify', 'copy', 'imagemin']);

}