import browserSync from 'browser-sync'
import del from 'del'
import fs from 'fs'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import runSequence from 'run-sequence'

const $ = gulpLoadPlugins()
const scenes = JSON.parse(fs.readFileSync('./data/github.json'))
const distDestination = 'dist'

gulp.task('copy', () => {
  return gulp.src([
    'app/robots.txt',
    'app/humans.txt',
  ], {
    dot: true
  }).pipe(gulp.dest(distDestination));
})

gulp.task('html', () => {
  return gulp.src('app/index.html')
    .pipe($.template({scenes: scenes}))
    .pipe(gulp.dest('.tmp'))
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(distDestination))
})

gulp.task('styles', () => {
  return gulp.src(['app/styles/main.scss'])
    .pipe($.sass({precision: 10}).on('error', $.sass.logError))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.cssnano())
    .pipe(gulp.dest(`${distDestination}/styles`))
})

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('.tmp/images'))
    .pipe(gulp.dest(`${distDestination}/images`))
})

gulp.task('scripts', () => {
  return gulp.src(['app/scripts/app.js'])
    .pipe($.uglify())
    .pipe(gulp.dest(`${distDestination}/scripts`))
})

gulp.task('serve', ['html', 'styles', 'images'], () => {
  browserSync({
    server: ['.tmp', 'app'],
    port: 3000
  })

  gulp.watch(['app/index.html'], ['html', browserSync.reload])
  gulp.watch(['app/images/**/*'], ['images', browserSync.reload])
  gulp.watch(['app/styles/**/*.scss'], ['styles', browserSync.reload])
})

gulp.task('clean', () => del(['.tmp', `dist`], {dot: true}))

gulp.task('dist', ['clean'], (callback) =>
  runSequence('copy', 'html', 'styles', 'scripts', 'images', callback)
)
