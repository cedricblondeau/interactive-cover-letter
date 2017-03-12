import browserSync from 'browser-sync'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'

const $ = gulpLoadPlugins()

gulp.task('styles', () => {
  return gulp.src(['app/styles/main.scss'])
    .pipe($.sass({precision: 10}).on('error', $.sass.logError))
    .pipe(gulp.dest('.tmp/styles'))
})

gulp.task('serve', ['styles'], () => {
  browserSync({
    server: ['app', '.tmp'],
    port: 3000
  })

  gulp.watch(['app/index.html'], [browserSync.reload])
  gulp.watch(['app/styles/**/*.scss'], ['styles', browserSync.reload])
})
