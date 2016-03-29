/**
 * Created by wb-chm174910 on 2016/3/29.
 */
var gulp = require('gulp'),
    less = require('gulp-less'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer')

gulp.task('lessToCss',function(){
    gulp.src('./index.less')
        .pipe(less())
        .pipe(autoprefixer({
            browser:['last 2 versiions']
        }))
        .pipe(gulp.dest('./'))
})

gulp.task('del',function(){
    del(['./index.css']);
})

gulp.task('watch',function(){
    gulp.watch('./index.less',['del','lessToCss'])
})
gulp.task('default',['watch']);