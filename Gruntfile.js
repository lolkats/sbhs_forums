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
				},
				{
					src:'bower_components/angular-route/angular-route.js',
					dest:'public/js/angular-route.min.plgn.js'
				},
				{
					cwd:'src/fonts',
					src:"**/*",
					dest:'public/fonts',
					expand:true
				},
				{
					cwd:'src/img',
					src:"**/*",
					dest:'public/img',
					expand:true
				},
				{
					cwd:'src/partials',
					src:"**/*",
					dest:'public/partials',
					expand:true
				}
				],
				options: {
					process: function (content, srcpath) {
						return content.replace('<{!timestamp}>', new Date());
					},
					processContentExclude: ['**/*.{png,gif,jpg,ico,psd,ttf,woff}']
				}
			}
		},
		concat: {
			basic_and_extras: {
				files: {
					"public/js/assets.js":["public/js/*.min.lib.js"],
					"public/js/plgn.js":["public/js/*.min.plgn.js"]
				}
			},
		}
	});
	require('load-grunt-tasks')(grunt);
	grunt.registerTask('default',['less','copy','uglify','concat']);
};