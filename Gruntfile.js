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
          dest: 'stylesheets/',
          ext: '.css'
        }]
      }
    },

    watch: {
      options: {
        livereload: '<%= connect.options.livereload %>'
      },
      html: {
        files: ['*.html']       // so that changes causes a livereload
      },
      styles: {
        files: ['scss/*.scss'],
        tasks: ['build']
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

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('build', ['sass', 'autoprefixer']);
  grunt.registerTask('serve', function (target) {
    grunt.task.run(['connect:livereload', 'watch']);
  });
};
