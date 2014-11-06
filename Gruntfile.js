module.exports = function (grunt) {
  grunt.initConfig({

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'scss/',
          src: ['*.scss'],
          dest: '.tmp/',
          ext: '.css'
        }]
      }
    },

    autoprefixer: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/',
          src: ['*.css'],
          dest: 'css/',
          ext: '.css'
        }]
      }
    },

    coffee: {
      compile: {
        files: [{
          expand: true,
          cwd: 'coffeescript/',
          src: ['*.coffee'],
          dest: 'javascript/',
          ext: '.js'
        }]
      }
    },

    watch: {
      options: {
        livereload: '<%= connect.options.livereload %>'
      },
      html: {
        files: ['*.html', 'html/*.html']       // so that changes causes a livereload
      },
      scss: {
        files: ['scss/*.scss'],
        tasks: ['sass', 'autoprefixer']
      },
      coffeescript: {
        files: ['coffeescript/*.coffee'],
        tasks: ['coffee']
      }
    },

    connect: {
      options: {
        port: 8000,
        livereload: 35729,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          base: ['.']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['clean', 'sass', 'autoprefixer', 'coffee']);
  grunt.registerTask('clean', 'Remove intermediate build files (delete all files in .tmp/).', function() {
    if (grunt.file.exists('.tmp')) {
      grunt.file.delete('.tmp')
    }
    if (grunt.file.exists('css')) {
      grunt.file.delete('css')
    }
  });
  grunt.registerTask('serve', function (target) {
    grunt.task.run(['clean', 'connect:livereload', 'watch']);
  });
};
