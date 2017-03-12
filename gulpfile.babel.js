import browserSync from 'browser-sync'
import gulp from 'gulp'

gulp.task('serve', () => {
  browserSync({
    server: ['app'],
    port: 3000
  })

  gulp.watch(['app/index.html'], [browserSync.reload])
})
