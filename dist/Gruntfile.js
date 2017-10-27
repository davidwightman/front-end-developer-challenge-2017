module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				}
			},
			uses_defaults: ['js/*.js'],
			with_overrides: {
				options: {
					curly: false,
					undef: true
				},
				files: {
					src: ['js/*.js']
				}
			}
		},

		sass: {
			dist: {
				options: {
					sourcemap: 'none'
				},
				files: [
					{
						expand: true,
						cwd: 'sass',
						src: ['**/*.scss'],
						dest: 'css',
						ext: '.css'
					}
				]
			}
		},

		postcss: {
			options: {
				map: false,
				processors: [
					require('autoprefixer')({
						browsers: ['last 2 versions']
					})
				]
			},
			dist: {
				src: 'css/main.css'
			}
		},

		cssmin: {
			options: {
				keepSpecialComments: 0
			},
			minify: {
				expand: true,
				cwd: 'css',
				src: ['*.css', '!*.min.css', '*.scss'],
				dest: 'build/css',
				ext: '.min.css'
			},
			target: {
				files: {
					'build/css/main.min.css': ['css/main.css', 'css/normalize.css', 'sassmain.css']
				}
			}
		},

		// cssmin: {
		// 	target: {
		// 		files: [
		// 			{
		// 				expand: true,
		// 				cwd: 'css',
		// 				src: ['*.css', '!*.min.css', '*.scss'],
		// 				dest: 'build/css',
		// 				ext: '.min.css'
		// 			}
		// 		],
		// 		combine: {
		// 			files: {
		// 				'build/css/main.min.css': ['css/main.css', 'css/normalize.css', 'sassmain.css']
		// 			}
		// 		}
		// 	}
		// },

		uglify: {
			build: {
				src: ['js/*.js'],
				dest: 'build/js/main.min.js'
			}
		},

		watch: {
			css: {
				files: ['**/*.scss', '**/*.css'],
				tasks: ['sass', 'postcss', 'cssmin']
			},
			js: {
				files: '**/*.js',
				tasks: ['uglify']
			}
		}
	});

	// Load Grunt plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Register Grunt tasks
	grunt.registerTask('default', ['watch', 'jshint:uses_defaults']);
};
