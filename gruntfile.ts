module.exports = (grunt: any) => {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jsdoc: {
			dist: {
				src: ['src/*.ts', 'test/*.ts'],
				options: {
					destination: 'doc'
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-jsdoc');
}