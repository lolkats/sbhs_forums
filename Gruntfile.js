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
		    		'public/js/bootstrap.min.js': 'bower_components/bootstrap/js/*',
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
				}
				],
				options: {
					process: function (content, srcpath) {
						return content.replace('<{!timestamp}>', new Date());
					}
				}
			}
		}
	});
	require('load-grunt-tasks')(grunt);
	grunt.registerTask('default',['less','copy','uglify']);
};