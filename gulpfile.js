var exec = require('child_process').exec;
var gulp = require('gulp');

gulp.task('watch', function(){
    gulp.watch(['./src/**/*.*'], ['webpackDev']);
});

gulp.task('default', function(){
    gulp.run('webpackDev');
    gulp.run('watch');
});

gulp.task('webpackDev',function(cb){
    exec('npm run build',function(err,stdout,stderr){
        console.log(stdout);
        cb(err);
    });
});
