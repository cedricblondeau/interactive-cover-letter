import browserSync from 'browser-sync'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'

const $ = gulpLoadPlugins()

gulp.task('html', () => {
  return gulp.src('app/index.html')
    .pipe($.template())
    .pipe(gulp.dest('.tmp'))
})

gulp.task('styles', () => {
  return gulp.src(['app/styles/main.scss'])
    .pipe($.sass({precision: 10}).on('error', $.sass.logError))
    .pipe(gulp.dest('.tmp/styles'))
})

gulp.task('serve', ['html', 'styles'], () => {
  browserSync({
    server: ['.tmp', 'app'],
    port: 3000
  })

  gulp.watch(['app/index.html'], ['html', browserSync.reload])
  gulp.watch(['app/styles/**/*.scss'], ['styles', browserSync.reload])
})
