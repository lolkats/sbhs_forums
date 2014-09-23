module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			options:{
				compress: true
			},
			src:{
				cwd: './',
				src: [
				'bower_components/bootstrap/less/bootstrap.less'
				],
				dest: 'public/css/combined.min.css'
			}
		},
		uglify : {
			options: {
	        //beautify:true
		    },
		    build : {
		    	files : {
		    		"public/js/app.min.js": "src/js/*"
		    	},
		    }
		},
		copy: {
			main: {
				files: [
				{
					cwd: 'bower_components/bootstrap/dist/fonts',
					src: '**/*',
					dest: 'public/fonts',
					expand: true
				},
				{
					src: 'bower_components/bootstrap/dist/js/bootstrap.min.js',
					dest:'public/js/bootstrap.min.lib.js'

				},
				{
					src: 'bower_components/jquery/dist/jquery.min.js',
					dest:'public/js/ajquery.min.lib.js'					
				},
				{
					src:'bower_components/angular/angular.min.js',
					dest:'public/js/angular.min.lib.js'
				}
				],
				options: {
					process: function (content, srcpath) {
						return content.replace('<{!timestamp}>', new Date());
					}
				}
			}
		},
		concat: {
			basic_and_extras: {
				files: {
					"public/js/assets.js":["public/js/*.min.lib.js"]
				}
			},
		}
	});
	require('load-grunt-tasks')(grunt);
	grunt.registerTask('default',['less','copy','uglify','concat']);
};