var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var src = 'static/';
var dest = 'lib/server/static/';

gulp.task('css', function () {
    gulp.src(src + 'css/style.less')
        .pipe($.less())
        .pipe($.autoprefixer())
        .pipe(gulp.dest(dest + 'css'));
});

gulp.task('js', function () {
    gulp.src(src + 'js/bio.js')
        .pipe($.browserify({
            insertGlobals: true,
            debug: true,
            nobuiltins: 'querystring',
            shim: {
                'angular': {
                    exports: 'angular',
                    path: 'bower_components/angular/angular.js'
                }
            }
        }))
        .pipe(gulp.dest(dest + 'js'));
});

gulp.task('everythingElse', function () {
    gulp.src(src + '**/*.{png,svg,html,eot,ttf,woff}').pipe(gulp.dest(dest));
});

gulp.task('default', ['css', 'js', 'everythingElse']);
