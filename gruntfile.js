module.exports = (grunt) => {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsdoc: {
            dist: {
                src: ['src/*.ts', 'test/*.ts'],
                options: {
                    destination: 'doc'
                }
            }
        },
        eslint: {
            src: ["src/**/*.ts"]
        },
        jshint: {},
    });

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('gruntify-eslint');

    grunt.registerTask('default', ['eslint'])   ;
}